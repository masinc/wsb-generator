import { ElectronAPI } from '@electron-toolkit/preload'

type Theme = 'light' | 'dark' | 'system'

interface WsbApi {
  loadWsb: () => Promise<{ filePath: string; content: string } | null>
  loadWsbFromPath: (filePath: string) => Promise<string | null>
  getFilePath: (file: File) => Promise<string | null>
  saveWsb: (content: string, filePath?: string) => Promise<string | null>
  saveWsbAs: (content: string) => Promise<string | null>
  showConfirmDialog: (message: string) => Promise<boolean>
  onBeforeClose: (callback: () => void) => void
  confirmClose: (canClose: boolean) => void
  onMenuNew: (callback: () => void) => void
  onMenuOpen: (callback: () => void) => void
  onMenuSave: (callback: () => void) => void
  onMenuSaveAs: (callback: () => void) => void
  setTitle: (title: string) => void
  selectFolder: (defaultPath?: string) => Promise<string | null>
  searchDirectories: (inputPath: string, currentFilePath?: string) => Promise<string[]>
  getTheme: () => Promise<Theme>
  setTheme: (theme: Theme) => Promise<void>
  onMenuThemeChange: (callback: (theme: Theme) => void) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: WsbApi
  }
}
