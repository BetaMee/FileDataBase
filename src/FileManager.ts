import path from 'path'
import {
    isImmutable,
    fromJS,
    Map,
    setIn,
    // getIn
} from 'immutable'

import {
    IFMDefaultData,
    IFMObject,
    IFMState
} from './common/interfaces'

import {
    GlobalErrorType
} from './common/constant'

import {
    statFile,
    readFile,
    writeFile
} from './FileTools'

// 单个文件数据库
export default class FileManager<T> {
    fileName: string
    fdbName: string
    fileState: IFMState // 文件中的数据
    fileValue: any // 临时的值
    defaultFileState: IFMDefaultData<T>;
    constructor(fdbName: string, fileName: string) {
        this.fdbName = fdbName
        this.fileName = fileName
        this.fileState = null
        this.fileValue = null
        this.defaultFileState = {
            _fmName: fileName,
            _fmPath: path.resolve(fdbName, fileName),
            _fmCreated: this._updateFMTime(),
            _fmUpdated: this._updateFMTime(),
            _fmData: {} as T
        }
    }
    _updateFMTime() {
        const date = new Date()

        const year = date.getFullYear()
        const month = date.getMonth() >= 9 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`
        const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`

        const hour = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`
        const min = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`
        const sec = date.getSeconds() > 9 ? date.getSeconds() : `0${ date.getSeconds()}`

        return `${year}-${month}-${day} ${hour}:${min}:${sec}`
    }
    // 初始存入数据 ，只有当 JSON 文件值为空的情况下才被使用
    default(defaultData: IFMObject<T>) {
        this.defaultFileState = {
            ...this.defaultFileState,
            _fmData: defaultData
        }
        return this
    }
    // 进行查询操作，载入状态中
    async load() {
        try {
            const fileStatus = await statFile(path.resolve(this.fdbName, this.fileName))
            if (fileStatus && fileStatus.isFile())  {
                const file = await readFile(path.resolve(this.fdbName, this.fileName), 'utf-8')
                const data = JSON.parse(file) as IFMDefaultData<T>
                this.setState(data)
            } else {
                // 需要新建文件
                await writeFile(path.resolve(this.fdbName, this.fileName), JSON.stringify(this.defaultFileState))
                this.setState(this.defaultFileState)
            }
            return this
        } catch(e) {
            return Promise.reject(new Error(GlobalErrorType.FM_ERROR_LOADFAIL))
        }
    }
    // 保存当前状态
    async save() {
        try {
            // 获取当前状态
            const state = this.getState()
            if (state) {
                // 更新时间
                state._fmUpdated = this._updateFMTime()
                await writeFile(
                    path.resolve(this.fdbName, this.fileName),
                    JSON.stringify(state)
                )
                return this
            } else {
                return Promise.reject(new Error(GlobalErrorType.FM_ERROR_WRITENULL_FORRBIDDEN))
            }
        } catch(e) {
            return Promise.reject(new Error(GlobalErrorType.FM_ERROR_WRITEFAIL))
        }
    }
    //  获取所有值
    getState() {
        if (Map.isMap(this.fileState)) {
            return this.fileState.toJS() as IFMDefaultData<T>
        } else {
            return null
        }
    }
    // 更新所有值
    setState(newState: IFMDefaultData<T> | IFMState) {
        if (Map.isMap(newState)) {
            this.fileState = newState
        } else if (newState && !Map.isMap(newState)) {
            this.fileState = fromJS(newState)
        } else {
            return
        }
    }
    // 返回当前搜索值
    value() {
        return isImmutable(this.fileValue) ? this.fileValue.toJS(): this.fileValue
    }
    get(key: string) {
        // 没有加载
        if (!Map.isMap(this.fileState)) {
            throw new Error(GlobalErrorType.FM_ERROR_NOTLOADEDDATA)
        } else if (Map.isMap(this.fileState.get('_fmData'))) {
            const imVal = this.fileState.get('_fmData').get(key)
            this.fileValue = imVal
        } else {
            this.fileValue = null
        }
        return this
    }
    getIn(keyList: (string | number)[]) {
        if (!Map.isMap(this.fileState)) {
            throw new Error(GlobalErrorType.FM_ERROR_NOTLOADEDDATA)
        } else if (Map.isMap(this.fileState.get('_fmData'))) {
            const imVal = this.fileState.get('_fmData').getIn(keyList)
            this.fileValue = imVal
        } else {
            this.fileValue = null
        }
        return this
    }
    // 改
    set(key: string, value: any) {
        if (!this.fileState || !Map.isMap(this.fileState)) {
            throw new Error(GlobalErrorType.FM_ERROR_SET_FORRBIDDEN)
        } else {
            const _fmData = this.fileState.get('_fmData')
            let newfileState = null
            if (Map.isMap(_fmData)) {
                newfileState = setIn(this.fileState, ['_fmData', key], fromJS(value))
                this.setState(newfileState)
                this.fileValue = newfileState
            }
        }
        return this
    }
    setIn(keyList: (string | number)[],  value: any) {
        if (!this.fileState || !Map.isMap(this.fileState)) {
            throw new Error(GlobalErrorType.FM_ERROR_SETIN_FORRBIDDEN)
        } else {
            const newfileState = setIn(this.fileState, ['_fmData', ...keyList], fromJS(value))
            this.setState(newfileState)
        }
        return this
    }
}
