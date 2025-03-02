const { app, BrowserWindow, ipcMain, event } = require('electron/main')
const path = require('node:path')

require("electron-reload")(path.join(__dirname), {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  ignored: /node_modules|[\/\\]\./,
});

let currentTheme = 'system';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 680,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: true
  })

  win.loadFile('index.html')
}

ipcMain.handle('get-initial-theme', () => {
  return currentTheme;
});

ipcMain.on('set-theme', (event, theme) => {
  currentTheme = theme;
  // Add persistent storage here if needed
});

ipcMain.on('window-control', (event, action) => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
      if (action === 'minimize') win.minimize()
      if (action === 'close') win.close()
  }
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})