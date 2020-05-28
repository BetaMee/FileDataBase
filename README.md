## FDB: A JSON File DataBase for Node.js

[![npm](http://img.shields.io/npm/dm/@gongxq/fdb.svg?style=flat)](https://www.npmjs.org/package/@gongxq/fdb)

[![npm](https://img.shields.io/npm/v/@gongxq/fdb.svg)](https://www.npmjs.org/package/@gongxq/fdb)

This lib can be used for Node.js application, like electron or anything you want yo store your data in dist JSON files.

It uses Node.js file modules to interact with dist files, and uses immutable.js as inner state, so there is no need to worry about JavaScript object reference and inadvertently change to your data, everything in the FDB is immutable. Only call specific API that can update dist files.

## Installation

`npm install @gongxq/fdb`

## Usgae

```ts
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
        const fdb = await fileDataBase.init()
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
```

## API

```ts
// FDB Object
const fileDataBase = new FDB(dbpathstring)
const fdb = await fileDataBase.init()

// FM Object
const fm = await fdb
    // Select which file you need to use
    // IFMType is your data interface
    .index<IFMType>('mydatafile')
    // Default data if your JSON file empty
    .default(initData)
    // load from dist
    .load()

// Get
fm.get(key: string).value()
fm.get(keyLsit: (string | number)[]).value()

// Set
fm.set(key: string, value: any)
fm.setIn(keyLsit: (string | number)[], value: any).

// Set & Get Chain
fm.set(key: string, value: any).get(key: string)

// Write
await fm.save()
```

## Example & Debug

First clone this repo:

`git clone git@github.com:BetaMee/FileDataBase.git`

And then run cli:

`npm run dev`

If you want to build lib:

`npm run build`
