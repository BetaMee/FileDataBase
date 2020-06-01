import FDB from '../src'
import path from 'path'

const dbpath = path.resolve(__dirname, './db')
const fileDataBase = new FDB(dbpath)

interface IFMType {
    a: string,
    b: number,
    c: {
        d: string
    }
}

const Start = async () => {
    try {
        const initData =  {
            a: 'hello',
            b: 0,
            c: {
                d: 'world'
            }
        }
        // 连接数据库
        const fdb = fileDataBase.initSync()
        // 指定一个文件作为当前数据存储地址
        // 进行加载，获取 fm 对象
        const fm = await fdb
            .index<IFMType>('file')
            .default(initData)
            .load()

        // Get value
        const a = fm.get('a').value()
        const e = fm.get('e').value()
        const d = fm.getIn(['c', 'd']).value()
        console.log(a, e, d) // hello undefined world

        // Set value(Async func)
        await fm.set('f', 'Good!').save()
        const f = fm.get('f').value()
        console.log(f) // Good!

    } catch(e) {
        console.log(e)
    }
}

Start()
