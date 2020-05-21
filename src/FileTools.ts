import fs from 'fs'

// 文件读写工具
const readDir = fs.promises.readdir
const writeFile = fs.promises.writeFile
const readFile = fs.promises.readFile
const mkdir = fs.promises.mkdir
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

export {
    readDir,
    writeFile,
    readFile,
    statFile,
    statDir,
    mkdir
}