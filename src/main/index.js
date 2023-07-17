import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const Realm = require('realm');

function createWindow() {

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })


 process.stdin.resume()

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }


}

app.whenReady().then(async () => {

  try {
  const app  = new Realm.App({id: 'realm_crud-vckms'});
  await app.logIn(Realm.Credentials.anonymous());
  
  const studentdataSchema = {
    name: 'studentdata',
    properties: {
      _id: 'objectId?',
      __v: 'int?',
      name: 'string?',
      roll: 'string?',
    },
    primaryKey: '_id',
  };
  
  const config = {
    schema: [studentdataSchema],
    path: 'my.realm',
    sync: {
      user: app.currentUser,
     // partitionValue: 'myPartition',
     flexible: true,
    },
  };
  
  // open a synced realm
  const realm = await Realm.open(config);

  // Get student Data
  ipcMain.handle('student', (_, data) => {
    realm.write(() => {
      realm.create('studentdata', data)
    })
  })

  } catch (error) {
    console.log("Realm Error: ",error);
  }

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
  
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
