import fs from 'fs'

// 文件读写工具
const readDir = fs.promises.readdir
const readDirSync = fs.readdirSync
const writeFile = fs.promises.writeFile
const readFile = fs.promises.readFile
const mkdir = fs.promises.mkdir
const unlink = fs.promises.unlink
const fsStat  = (path: string) => new Promise<false | fs.Stats>((resolve) => {
    fs.stat(path, (err, stat) => {
        if (err) {
            resolve(false)
        } else {
            resolve(stat)
        }
    })
})

const statDir = fsStat
const statFile = fsStat

const statDirSync = fs.statSync
const mkdirSync = fs.mkdirSync

export {
    readDir,
    readDirSync,
    writeFile,
    readFile,
    statFile,
    statDirSync,
    statDir,
    mkdir,
    mkdirSync,
    unlink
}