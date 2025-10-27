import { ipcMain, dialog } from 'electron'
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { execSync } from 'child_process'

export function registerFileHandlers(): void {
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
}
