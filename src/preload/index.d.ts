import { ElectronAPI } from '@electron-toolkit/preload'

interface WsbApi {
  loadWsb: () => Promise<{ filePath: string; content: string } | null>
  saveWsb: (content: string, filePath?: string) => Promise<string | null>
  saveWsbAs: (content: string) => Promise<string | null>
  onMenuNew: (callback: () => void) => void
  onMenuOpen: (callback: () => void) => void
  onMenuSave: (callback: () => void) => void
  onMenuSaveAs: (callback: () => void) => void
  setTitle: (title: string) => void
  selectFolder: () => Promise<string | null>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: WsbApi
  }
}
