import pathModule from 'path'
import XLSX from 'xlsx'
import os from 'os'
import fs from 'fs'
import * as Constants from '../constants/Application'
import pinyin from 'pinyin4js'
import {
    PinyinHelper
} from 'pinyin4js/lib/PinyinHelper'

/**
 * 判断文件是否是excel文件
 * @param {string} path 文件路径
 */
export function isExcelFile(path) {
    const extname = pathModule.extname(path)
    const regexp = /^.xlsx$/
    return regexp.test(extname)
}
/**
 * 读取文件
 * @param {string} filePath 文件路径 
 */
export async function readExcelFile(_this, filePath) {
    let readSuccess = false
    // try {
        const workbook = XLSX.readFile(filePath)
        const sheetName = workbook.SheetNames[0]
        const worksheetData = workbook.Sheets[sheetName]
        // fs.writeFile('log.log', JSON.stringify(worksheetData),function(err){
        //     console.log(err)
        // })
        // 获取表头
        const scope = worksheetData['!ref'].split(':') // A1 F5
        const startColumn = getNumCol(extractLetters(scope[0])) // Excel 是从 1 开始
        const endColumn = getNumCol(extractLetters(scope[1]))
        const startRow = parseInt(extractNumber(scope[0])) + 1
        const endRow = parseInt(extractNumber(scope[1]))
        let headerList = []
        for (let i = startColumn, emptyColumn = 0; i <= endColumn; i++) {
            const curColKey = typeof worksheetData[`${getCharCol(i)}${startRow}`] === 'undefined' ? `表头空${emptyColumn++}` : worksheetData[`${getCharCol(i)}${startRow}`].v
            const headKey = PinyinHelper.getShortPinyin(curColKey)
            worksheetData[`${getCharCol(i)}${startRow}`].v = headKey
            worksheetData[`${getCharCol(i)}${startRow}`].h = headKey
            worksheetData[`${getCharCol(i)}${startRow}`].w = headKey
            let headerObject = {}
            headerObject.title = curColKey
            headerObject.key = headKey
            headerList.push(headerObject)
            for (let row = startRow + 1; row <= endRow; row++) {
                if (i == endColumn) {
                    let newColumn
                    if (row == (startRow + 1)) {
                        newColumn = `${getCharCol(i+1)}${startRow}`
                        worksheetData[newColumn] = {
                            t: 's',
                            v: 'index',
                            w: 'index'
                        }
                        newColumn = `${getCharCol(i+1)}${row}`
                        worksheetData[newColumn] = {
                            t: 's',
                            v: row,
                            w: row
                        }
                    } else {
                        newColumn = `${getCharCol(i+1)}${row}`
                        worksheetData[newColumn] = {
                            t: 'n',
                            v: row,
                            w: row
                        }
                    }
                }
                const rowKey = `${getCharCol(i)}${row}`
                if (typeof worksheetData[rowKey] === 'undefined') {
                    worksheetData[rowKey] = {
                        t: 's',
                        v: '',
                        w: ''
                    }
                }
            }
        }
        worksheetData['!ref'] = `${getCharCol(startColumn)}${startRow}:${getCharCol(endColumn+1)}${endRow}`
        const tableData = XLSX.utils.sheet_to_json(worksheetData)
        const currentFilePath = os.homedir + Constants.separator + Constants.appDir + Constants.separator + pathModule.parse(filePath).name
        localStorage.setItem('currentTable', currentFilePath)
        await _this.$db.insertDocument(currentFilePath, tableData).then(function (res) {
            readSuccess = res
        })
    // } catch (error) {
    //     console.log(error)
    //     readSuccess = false
    // }
    return readSuccess
}
export function saveExcelFile(_this, targetPath) {
    _this.$db.findDocument(localStorage.getItem('currentTable'), {}).then(result => {
        const sheetData = XLSX.utils.json_to_sheet(handleJson(result))
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, sheetData, "Sheet1");
        XLSX.writeFile(wb, targetPath);
    }).catch(err => {
        _this.$Notice.error({
            title: '文件导出异常',
            desc: err
        });
    })
}
/**
 * 删除从nedb中查询出来的数据中的_id
 * @param {array} jsonData 
 */
export function handleJson(jsonData) {
    for (const item of jsonData) {
        delete item._id
        delete item.createdAt
        delete item.updatedAt
        delete item.index
    }
    return jsonData
}

// 提取字母
function extractLetters(str) {
    return str.replace(/[^a-zA-Z]+/g, '')
}

// 提取数字
function extractNumber(str) {
    return str.replace(/[^0-9]/ig, '');
}

function getCharCol(n) {
    let s = ''
    let m = 0
    while (n >= 0) {
        m = (n % 26) + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
    }
    return s
}

function getNumCol(s) {
    if (!s) return 0
    let n = 0
    for (let i = s.length - 1, j = 1; i >= 0; i--, j *= 26) {
        const c = s[i].toUpperCase()
        if (c < 'A' || c > 'Z') return 0
        n += (c.charCodeAt() - 64) * j
    }
    return n - 1
}