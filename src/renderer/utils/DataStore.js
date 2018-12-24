import Nedb from 'nedb'
import os from 'os'
import fs from 'fs'
import * as Constants from '../constants/Application'
export default class DataStore {
    constructor() {
        this.instancePool = new Map()
    }
    /**
     * 应用初始化，创建应用数据目录
     */
    init() {
        const homedir = os.homedir();
        const appDir = homedir + Constants.separator + Constants.appDir
        fs.access(appDir, (err) => {
            if (err) {
                fs.mkdir(appDir, (err) => {
                    console.log(err)
                })
            }
        })
    }

    /**
     * 获取数据库实例
     * @param {string} table 
     */
    getDbInstance(table) {
        let db  = this.instancePool.get(table);
        if (db === undefined) {
            db = new Nedb({
                filename: table,
                autoload: true,
                timestampData: true
            })
            this.instancePool.set(table, db)
        }
        return db
    }
    /**
     * 向数据库插入数据
     * @param {string} table 
     * @param {object} documents 
     */
    insertDocument(table, documents) {
        const _this = this
        return new Promise(function (resolve, reject) {
            const db = _this.getDbInstance(table)
            db.insert(documents, function (err) {
                if (err != null) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    }


    /**
     * 查找数据
     * get all data when the params is null
     * @param {string} table 
     * @param {object} params 
     */
    findDocument(table, params) {
        const _this = this
        return new Promise(function (resolve, reject) {
            const db = _this.getDbInstance(table)
            db.find(params).sort({createdAt: 1}).exec(function (err, doc) {
                if (err !== null) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            })
        })
    }
}