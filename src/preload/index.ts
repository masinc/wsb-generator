import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  loadWsb: () => ipcRenderer.invoke('load-wsb'),
  loadWsbFromPath: (filePath: string) => ipcRenderer.invoke('load-wsb-from-path', filePath),
  getFilePath: (file: File) => {
    try {
      return Promise.resolve(webUtils.getPathForFile(file))
    } catch (error) {
      console.error('Failed to get file path:', error)
      return Promise.resolve(null)
    }
  },
  saveWsb: (content: string, filePath?: string) =>
    ipcRenderer.invoke('save-wsb', content, filePath),
  saveWsbAs: (content: string) => ipcRenderer.invoke('save-wsb-as', content),
  showConfirmDialog: (message: string) => ipcRenderer.invoke('show-confirm-dialog', message),
  onBeforeClose: (callback: () => void) => ipcRenderer.on('before-close', callback),
  confirmClose: (canClose: boolean) => ipcRenderer.send('close-confirmed', canClose),
  onMenuNew: (callback: () => void) => ipcRenderer.on('menu-new', callback),
  onMenuOpen: (callback: () => void) => ipcRenderer.on('menu-open', callback),
  onMenuSave: (callback: () => void) => ipcRenderer.on('menu-save', callback),
  onMenuSaveAs: (callback: () => void) => ipcRenderer.on('menu-save-as', callback),
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
  selectFolder: (defaultPath?: string) => ipcRenderer.invoke('select-folder', defaultPath),
  searchDirectories: (inputPath: string, currentFilePath?: string) =>
    ipcRenderer.invoke('search-directories', inputPath, currentFilePath)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
