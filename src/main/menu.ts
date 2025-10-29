import { app, BrowserWindow, Menu } from 'electron'
import { store } from './store'

export function createApplicationMenu(mainWindow: BrowserWindow): Menu {
  const currentTheme = store.get('theme')

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new')
          }
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('menu-open')
          }
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-save')
          }
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            mainWindow.webContents.send('menu-save-as')
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Theme',
          submenu: [
            {
              label: 'Light',
              type: 'radio',
              checked: currentTheme === 'light',
              click: () => {
                mainWindow.webContents.send('menu-theme-change', 'light')
              }
            },
            {
              label: 'Dark',
              type: 'radio',
              checked: currentTheme === 'dark',
              click: () => {
                mainWindow.webContents.send('menu-theme-change', 'dark')
              }
            },
            {
              label: 'System',
              type: 'radio',
              checked: currentTheme === 'system',
              click: () => {
                mainWindow.webContents.send('menu-theme-change', 'system')
              }
            }
          ]
        }
      ]
    }
  ])

  Menu.setApplicationMenu(menu)
  return menu
}
