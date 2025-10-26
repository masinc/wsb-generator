import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  loadWsb: () => ipcRenderer.invoke('load-wsb'),
  saveWsb: (content: string, filePath?: string) => ipcRenderer.invoke('save-wsb', content, filePath),
  saveWsbAs: (content: string) => ipcRenderer.invoke('save-wsb-as', content),
  onMenuNew: (callback: () => void) => ipcRenderer.on('menu-new', callback),
  onMenuOpen: (callback: () => void) => ipcRenderer.on('menu-open', callback),
  onMenuSave: (callback: () => void) => ipcRenderer.on('menu-save', callback),
  onMenuSaveAs: (callback: () => void) => ipcRenderer.on('menu-save-as', callback),
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
  selectFolder: () => ipcRenderer.invoke('select-folder')
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
