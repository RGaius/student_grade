import Nedb from 'nedb'
import os from 'os'
import fs from 'fs'
import * as Constants from '../constants/Application'

/**
 * 应用初始化，创建应用数据目录
 */
export function init() {
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
export function getDbInstance(table) {
    const db = new Nedb({
        filename: table,
        autoload: true
    })
    return db
}
/**
 * 向数据库插入数据
 * @param {string} table 
 * @param {object} documents 
 */
export function insertDocument(table, documents) {
    return new Promise(function (resolve, reject) {
        const db = getDbInstance(table)
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
export function findDocument(table, params) {
    return new Promise(function (resolve, reject) {
        const db = getDbInstance(table)
        db.find(params, function (err, doc) {
            if (err !== null) {
                reject(err)
            } else {
                resolve(doc)
            }
        })
    })
}