import FileManager from './FileManager'

import {
    readDir,
    readDirSync,
    statDir,
    statDirSync,
    mkdir,
    mkdirSync,
    unlink
} from './FileTools'

import {
    GlobalErrorType
} from './common/constant'

// 文件数据库
export default class FileDataBase {
    // 文件地址
    fdbPath: string
    // 所有的数据文件列表
    fdbFileList: {
        [k: string]: FileManager<any>
    }
    constructor(fdbpath: string) {
        this.fdbPath = fdbpath
        this.fdbFileList = {}
    }
    // 读取文件
    async _laodFileList () {
        // 读取文件夹
        const fdbDirs = await readDir(this.fdbPath)
        fdbDirs
            .filter(fileName => fileName !== '.DS_Store')
            .forEach(fileName => {
            this.fdbFileList[fileName] = new FileManager<any>(this.fdbPath, fileName)
        })
    }
    _laodFileListSync () {
        // 读取文件夹
        const fdbDirs =  readDirSync(this.fdbPath)
        fdbDirs
            .filter(fileName => fileName !== '.DS_Store')
            .forEach(fileName => {
            this.fdbFileList[fileName] = new FileManager<any>(this.fdbPath, fileName)
        })
    }
    // 初始化数据库，读取文件夹
    async init() {
        try {
            // 判断是否有文件夹
            const dirStat = await statDir(this.fdbPath)
            if (dirStat && dirStat.isDirectory()) {
                await this._laodFileList()
            } else {
                // 新建文件夹
                await mkdir(this.fdbPath)
                await this._laodFileList()
            }
            return this
        } catch(e) {
            return Promise.reject(new Error(GlobalErrorType.FDB_ERROR_INITFAIL))
        }
    }
    initSync() {
        try {
            // 判断是否有文件夹
            const dirStat = statDirSync(this.fdbPath)
            if (dirStat && dirStat.isDirectory()) {
                this._laodFileListSync()
            } else {
                // 新建文件夹
                mkdirSync(this.fdbPath)
                this._laodFileListSync()
            }
            return this
        } catch(e) {
            throw new Error(GlobalErrorType.FDB_ERROR_INITFAIL)
        }
    }
    // 获取所有的文件数据
    async all<U>() {
        const promisedFileList: Promise<FileManager<U>>[] = []
        for (const fileName in this.fdbFileList) {
            if (fileName) {
                promisedFileList.push(this.fdbFileList[fileName].load())
            }
        }
        const fileData = await Promise.all(promisedFileList)

        return fileData.map(d => d.getRawState())
    }
    // 选中哪一个文件数据库
    index<T>(name: string): FileManager<T> {
        const fileName = `${name}.json`
        if (this.fdbFileList[fileName]) {
            return this.fdbFileList[fileName]
        } else {
            const fm = new FileManager<T>(this.fdbPath, fileName)
            this.fdbFileList[fileName] = fm
            return fm
        }
    }
    // 移除某一个文件数据库
    async remove(name: string) {
        const fileName = `${name}.json`
        if (this.fdbFileList[fileName]) {
            try {
                // 删除指定的文件
                await unlink(fileName)
                delete this.fdbFileList[fileName]
                return Promise.resolve()
            } catch(e) {
                return Promise.reject(new Error(GlobalErrorType.FDB_ERROR_REMOVEFILE))
            }
        }
    }
}
