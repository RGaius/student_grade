import fs from 'fs'


/**
 * 获取目标文件夹下文件列表
 * @param {string} path 目标文件夹
 */
export function getTargetDirFiles(path){
    let files = []
    try {
        fs.accessSync(path)
        files = fs.readdirSync(path)
    } catch (error) {
        console.log('判断文件夹是否存在异常:' + error)
    }
    return files
}