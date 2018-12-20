import pathModule from 'path'
import XLSX from 'xlsx'
import os from 'os'
import {insertDocument} from './DataStore'

/**
 * 判断文件是否是excel文件
 * @param {string} path 文件路径
 */
export function isExcelFile(path) {
    const extname = pathModule.extname(path)
    const regexp = /^.xls(x)?$/
    return regexp.test(extname)
}
/**
 * 读取文件
 * @param {string} filePath 文件路径 
 */
export async function readExcelFile(filePath){
    let readSuccess = false
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const tableData = XLSX.utils.sheet_to_json(worksheet)
    await insertDocument(os.homedir + '\\.StudentGrade' + '\\studentInfo.db', tableData).then(function (res){
        readSuccess =  res
    })
    return readSuccess
}