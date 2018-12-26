import {
  app,
  BrowserWindow,
  dialog,
  ipcMain
} from 'electron'
import DataStore from '../renderer/utils/DataStore'
import pathModule from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

function createWindow() {
  new DataStore().init()
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 500,
    useContentSize: true,
    width: 770
  })
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
// 打开文件夹
ipcMain.on('sync-openFile-dialog', (event, arg) => {
  dialog.showOpenDialog({
    title: '请选择Excel文件',
    filters: [{
      name: 'Excel File',
      extensions: ['xlsx']
    }],
    properties: ['openFile']
  }, function (arr) {
    console.log(arr)
    if (typeof arr !== 'undefined') {
      if (event) {
        event.sender.send('open-file-response', arr[0])
      }
    }
  })
})

ipcMain.on('sync-saveFile-dialog', (event, arg) => {
  dialog.showSaveDialog({
    title: '请选择目标文件夹',
    defaultPath: pathModule.parse(arg[0]).base + '.xlsx'
  }, function (filename) {
    if (event) {
      event.sender.send('save-file-response', filename)
    }
  })
})

ipcMain.on('resize-window', () => {
  mainWindow.setSize(1070, 740)
})