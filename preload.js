const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  setTheme: (theme) => ipcRenderer.send('set-theme', theme),
  getInitialTheme: () => ipcRenderer.invoke('get-initial-theme'),
  onThemeUpdate: (callback) => {
    ipcRenderer.on('theme-updated', (event, theme) => callback(theme))
  },
  minimize: () => ipcRenderer.send('window-control', 'minimize'),
  maximize: () => ipcRenderer.send('window-control', 'maximize'),
  close: () => ipcRenderer.send('window-control', 'close'),
})