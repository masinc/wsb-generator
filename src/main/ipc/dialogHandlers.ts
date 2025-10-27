import { ipcMain, dialog, BrowserWindow } from 'electron'

export function registerDialogHandlers(): void {
  ipcMain.handle('show-confirm-dialog', async (_event, message: string) => {
    const window = BrowserWindow.fromWebContents(_event.sender)
    if (!window) return false

    const result = await dialog.showMessageBox(window, {
      type: 'question',
      buttons: ['Cancel', 'OK'],
      defaultId: 1,
      cancelId: 0,
      message: message,
      detail: 'Your changes will be lost if you do not save them.'
    })

    return result.response === 1
  })

  ipcMain.on('close-confirmed', (_event, canClose: boolean) => {
    if (canClose) {
      const window = BrowserWindow.fromWebContents(_event.sender)
      if (window) {
        window.destroy()
      }
    }
  })

  ipcMain.on('set-title', (_event, title: string) => {
    const window = BrowserWindow.fromWebContents(_event.sender)
    if (window) {
      window.setTitle(title)
    }
  })
}
