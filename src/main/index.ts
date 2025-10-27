import { app, shell, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import { join, dirname } from 'path'
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 900,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // Open DevTools in development mode
    if (is.dev) {
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('close', (event) => {
    event.preventDefault()
    mainWindow.webContents.send('before-close')
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Create application menu
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
    }
  ])
  Menu.setApplicationMenu(menu)

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Handle close confirmation response
  ipcMain.on('close-confirmed', (_event, canClose: boolean) => {
    if (canClose) {
      const window = BrowserWindow.fromWebContents(_event.sender)
      if (window) {
        window.destroy()
      }
    }
  })

  // WSB file handlers
  ipcMain.handle('load-wsb', async () => {
    const result = await dialog.showOpenDialog({
      filters: [{ name: 'WSB Files', extensions: ['wsb'] }],
      properties: ['openFile']
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    const filePath = result.filePaths[0]
    const content = readFileSync(filePath, 'utf-8')
    return { filePath, content }
  })

  ipcMain.handle('load-wsb-from-path', async (_event, filePath: string) => {
    try {
      const content = readFileSync(filePath, 'utf-8')
      return content
    } catch (error) {
      console.error('Failed to load WSB file:', error)
      return null
    }
  })

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

  ipcMain.handle('save-wsb', async (_event, content: string, filePath?: string) => {
    let targetPath = filePath

    if (!targetPath) {
      const result = await dialog.showSaveDialog({
        filters: [{ name: 'WSB Files', extensions: ['wsb'] }],
        defaultPath: 'config.wsb'
      })

      if (result.canceled || !result.filePath) {
        return null
      }

      targetPath = result.filePath
    }

    writeFileSync(targetPath, content, 'utf-8')
    return targetPath
  })

  ipcMain.handle('save-wsb-as', async (_event, content: string) => {
    const result = await dialog.showSaveDialog({
      filters: [{ name: 'WSB Files', extensions: ['wsb'] }],
      defaultPath: 'config.wsb'
    })

    if (result.canceled || !result.filePath) {
      return null
    }

    writeFileSync(result.filePath, content, 'utf-8')
    return result.filePath
  })

  ipcMain.on('set-title', (_event, title: string) => {
    const window = BrowserWindow.fromWebContents(_event.sender)
    if (window) {
      window.setTitle(title)
    }
  })

  ipcMain.handle('select-folder', async (_event, defaultPath?: string) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      defaultPath: defaultPath
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    return result.filePaths[0]
  })

  ipcMain.handle(
    'search-directories',
    async (_event, inputPath: string, currentFilePath?: string) => {
      try {
        // Empty input - return WSB file directory first, then available drives
        if (!inputPath || inputPath.trim() === '') {
          const results: string[] = []

          // Add current WSB file directory if available
          if (currentFilePath) {
            const wsbDir = dirname(currentFilePath)
            if (existsSync(wsbDir)) {
              results.push(wsbDir)
            }
          }

          // Add available drives
          try {
            // Get available drives using wmic command
            const output = execSync('wmic logicaldisk get name', { encoding: 'utf-8' })
            const drives = output
              .split('\n')
              .map((line) => line.trim())
              .filter((line) => line && line.match(/^[A-Z]:$/))
              .map((drive) => drive + '\\')
            results.push(...drives)
          } catch (err) {
            console.warn('Failed to get drives, using fallback:', err)
            const fallbackDrives = ['C:\\', 'D:\\', 'E:\\', 'F:\\'].filter((drive) =>
              existsSync(drive)
            )
            results.push(...fallbackDrives)
          }

          return results.length > 0 ? results : ['C:\\']
        }

        // Normalize path separators to backslash for Windows
        let normalized = inputPath.replace(/\//g, '\\')

        // Handle drive letter input (e.g., "C" -> match drives starting with C)
        if (normalized.match(/^[A-Z]$/i)) {
          try {
            const output = execSync('wmic logicaldisk get name', { encoding: 'utf-8' })
            const drives = output
              .split('\n')
              .map((line) => line.trim())
              .filter((line) => line && line.match(/^[A-Z]:$/))
              .filter((drive) => drive.toLowerCase().startsWith(normalized.toLowerCase()))
              .map((drive) => drive + '\\')
            return drives.length > 0 ? drives : []
          } catch (err) {
            console.warn('Failed to get drives:', err)
            return []
          }
        }

        // Keep trailing backslash for drive roots (e.g., "C:\"), remove for other paths
        const isDriveRoot = normalized.match(/^[A-Z]:\\$/i)
        if (!isDriveRoot) {
          normalized = normalized.replace(/[\\]+$/, '')
        }

        const results: string[] = []

        // If path exists and is a directory, return its subdirectories
        if (existsSync(normalized) && statSync(normalized).isDirectory()) {
          try {
            const entries = readdirSync(normalized, { withFileTypes: true })
            const dirs = entries
              .filter((entry) => entry.isDirectory())
              .map((entry) => join(normalized, entry.name))
            results.push(...dirs)
          } catch (err) {
            // Permission denied or other read error - return empty array
            console.warn('Failed to read directory:', normalized, err)
          }
        }

        // Try parent directory for partial matches (but not for drive roots)
        if (!isDriveRoot) {
          const parentDir = dirname(normalized)
          const baseName = normalized.substring(parentDir.length + 1).toLowerCase()

          if (parentDir !== normalized && existsSync(parentDir)) {
            try {
              const entries = readdirSync(parentDir, { withFileTypes: true })
              const matches = entries
                .filter(
                  (entry) => entry.isDirectory() && entry.name.toLowerCase().startsWith(baseName)
                )
                .map((entry) => join(parentDir, entry.name))
              results.push(...matches)
            } catch (err) {
              // Permission denied or other read error
              console.warn('Failed to read parent directory:', parentDir, err)
            }
          }
        }

        return [...new Set(results)]
      } catch (error) {
        console.error('Error searching directories:', error)
        return []
      }
    }
  )

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
