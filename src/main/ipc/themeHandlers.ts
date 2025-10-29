import { ipcMain } from 'electron'
import { store, type Theme } from '../store'

export function registerThemeHandlers(): void {
  // Get theme from store
  ipcMain.handle('get-theme', () => {
    return store.get('theme')
  })

  // Set theme in store
  // Note: Menu radio buttons are automatically updated when clicked,
  // so we don't need to manually update the menu here
  ipcMain.handle('set-theme', (_event, theme: Theme) => {
    store.set('theme', theme)
  })
}
