import FileManager from './FileManager'

import {
    IFDBManifest
} from './common/interfaces'

import {
    readDir,
    writeFile,
    readFile,
    statDir,
    mkdir
} from './FileTools'

import {
    GlobalErrorType
} from './common/constant'

// 文件数据库
export default class FileDataBase {
    // 默认配置
    defaultFdbManifest: IFDBManifest
    // 文件地址
    fdbPath: string
    // meta 数据，用于记录文件数据库的信息
    fdbManifest: IFDBManifest | null
    // 所有的数据文件列表
    fdbFileList: {
        [k: string]: FileManager<any>
    }
    constructor(fdbpath: string) {
        this.fdbPath = fdbpath
        this.fdbManifest = null
        this.fdbFileList = {}
        this.defaultFdbManifest = {
            _fdbVersion: "0.1",
            _fdbName: "db",
            _fdbPath: "",
            _fdbFileList: []
        }
    }
    // 读取文件
    async _laodManifest () {
        // 读取文件夹
        const fdbDirs = await readDir(this.fdbPath)
        // 空文件夹
        // 存在 manifest.json
        if (fdbDirs.includes('manifest.json')) {
            const manifest = await readFile(`${this.fdbPath}/manifest.json`, 'utf-8')
            const parsedManifest = JSON.parse(manifest) as IFDBManifest
            this.fdbManifest = parsedManifest
        } else {
            await writeFile(
                `${this.fdbPath}/manifest.json`,
                JSON.stringify(this.defaultFdbManifest),
                'utf8'
            )
            this.fdbManifest = this.defaultFdbManifest
        }
    }
    // 初始化数据库，读取文件夹
    // 如果有 manifest.json 就读取，如果没有则生成一个
    async init() {
        try {
            // 判断是否有文件夹
            const dirStat = await statDir(this.fdbPath)
            if (dirStat && dirStat.isDirectory()) {
                this._laodManifest()
            } else {
                // 新建文件夹
                await mkdir(this.fdbPath)
                this._laodManifest()
            }
            return this
        } catch(e) {
            return Promise.reject(new Error(GlobalErrorType.FDB_ERROR_INITFAIL))
        }
    }
    // 选中哪一个文件数据库
    index<T>(name: string): FileManager<T> {
        if (this.fdbFileList[name]) {
            return this.fdbFileList[name]
        } else {
            const fm = new FileManager<T>(this.fdbPath, name)
            this.fdbFileList[name] = fm
            return fm
        }
    }
    // 关闭数据库
    close () {
        for (const fmKey in this.fdbFileList) {
            if (fmKey) {
                delete this.fdbFileList[fmKey]
            }
        }
    }
}
