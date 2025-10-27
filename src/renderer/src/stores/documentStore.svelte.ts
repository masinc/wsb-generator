import type { WsbConfiguration } from '@jsr/masinc__wsb'
import { parse, serialize } from '@jsr/masinc__wsb'

class DocumentStore {
  config = $state<WsbConfiguration>({
    VGpu: 'Default',
    Networking: 'Default',
    AudioInput: 'Default',
    VideoInput: 'Default',
    ProtectedClient: 'Default',
    PrinterRedirection: 'Default',
    ClipboardRedirection: 'Default',
    MappedFolders: { MappedFolder: [] },
    LogonCommand: { Command: '' }
  })

  currentFilePath = $state<string | null>(null)
  savedConfig = $state<string>(JSON.stringify(this.config))

  isModified = $derived(JSON.stringify(this.config) !== this.savedConfig)

  newConfig(): void {
    this.config = {
      VGpu: 'Default',
      Networking: 'Default',
      AudioInput: 'Default',
      VideoInput: 'Default',
      ProtectedClient: 'Default',
      PrinterRedirection: 'Default',
      ClipboardRedirection: 'Default',
      MappedFolders: { MappedFolder: [] },
      LogonCommand: { Command: '' }
    }
    this.currentFilePath = null
    this.savedConfig = JSON.stringify(this.config)
  }

  async loadConfig(): Promise<{ success: boolean; message?: string }> {
    const result = await window.api.loadWsb()
    if (!result) {
      return { success: false }
    }

    try {
      const parsed = parse(result.content)
      this.config = {
        VGpu: parsed.Configuration.VGpu || 'Default',
        Networking: parsed.Configuration.Networking || 'Default',
        AudioInput: parsed.Configuration.AudioInput || 'Default',
        VideoInput: parsed.Configuration.VideoInput || 'Default',
        ProtectedClient: parsed.Configuration.ProtectedClient || 'Default',
        PrinterRedirection: parsed.Configuration.PrinterRedirection || 'Default',
        ClipboardRedirection: parsed.Configuration.ClipboardRedirection || 'Default',
        MemoryInMB: parsed.Configuration.MemoryInMB,
        MappedFolders: parsed.Configuration.MappedFolders || { MappedFolder: [] },
        LogonCommand: parsed.Configuration.LogonCommand || { Command: '' }
      }
      this.currentFilePath = result.filePath
      this.savedConfig = JSON.stringify(this.config)
      return { success: true, message: `Loaded: ${result.filePath}` }
    } catch (error) {
      return {
        success: false,
        message: `Failed to parse WSB file: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }

  async loadConfigFromPath(filePath: string): Promise<{ success: boolean; message?: string }> {
    try {
      const content = await window.api.loadWsbFromPath(filePath)
      if (!content) {
        return { success: false, message: 'Failed to load file' }
      }

      const parsed = parse(content)
      this.config = {
        VGpu: parsed.Configuration.VGpu || 'Default',
        Networking: parsed.Configuration.Networking || 'Default',
        AudioInput: parsed.Configuration.AudioInput || 'Default',
        VideoInput: parsed.Configuration.VideoInput || 'Default',
        ProtectedClient: parsed.Configuration.ProtectedClient || 'Default',
        PrinterRedirection: parsed.Configuration.PrinterRedirection || 'Default',
        ClipboardRedirection: parsed.Configuration.ClipboardRedirection || 'Default',
        MemoryInMB: parsed.Configuration.MemoryInMB,
        MappedFolders: parsed.Configuration.MappedFolders || { MappedFolder: [] },
        LogonCommand: parsed.Configuration.LogonCommand || { Command: '' }
      }
      this.currentFilePath = filePath
      this.savedConfig = JSON.stringify(this.config)
      return { success: true, message: `Loaded: ${filePath}` }
    } catch (error) {
      return {
        success: false,
        message: `Failed to load WSB file: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }

  serializeConfig(): string {
    const cleanConfig: WsbConfiguration = {}
    if (this.config.VGpu && this.config.VGpu !== 'Default') cleanConfig.VGpu = this.config.VGpu
    if (this.config.Networking && this.config.Networking !== 'Default')
      cleanConfig.Networking = this.config.Networking
    if (this.config.AudioInput && this.config.AudioInput !== 'Default')
      cleanConfig.AudioInput = this.config.AudioInput
    if (this.config.VideoInput && this.config.VideoInput !== 'Default')
      cleanConfig.VideoInput = this.config.VideoInput
    if (this.config.ProtectedClient && this.config.ProtectedClient !== 'Default')
      cleanConfig.ProtectedClient = this.config.ProtectedClient
    if (this.config.PrinterRedirection && this.config.PrinterRedirection !== 'Default')
      cleanConfig.PrinterRedirection = this.config.PrinterRedirection
    if (this.config.ClipboardRedirection && this.config.ClipboardRedirection !== 'Default')
      cleanConfig.ClipboardRedirection = this.config.ClipboardRedirection
    if (this.config.MemoryInMB) cleanConfig.MemoryInMB = this.config.MemoryInMB
    if (this.config.MappedFolders && this.config.MappedFolders.MappedFolder) {
      const folders = Array.isArray(this.config.MappedFolders.MappedFolder)
        ? this.config.MappedFolders.MappedFolder
        : [this.config.MappedFolders.MappedFolder]
      if (folders.length > 0) cleanConfig.MappedFolders = this.config.MappedFolders
    }
    if (this.config.LogonCommand && this.config.LogonCommand.Command)
      cleanConfig.LogonCommand = this.config.LogonCommand

    return serialize({ Configuration: cleanConfig })
  }

  async saveConfig(): Promise<{ success: boolean; message?: string }> {
    try {
      const content = this.serializeConfig()
      const savedPath = await window.api.saveWsb(content, this.currentFilePath || undefined)
      if (savedPath) {
        this.currentFilePath = savedPath
        this.savedConfig = JSON.stringify(this.config)
        return { success: true, message: `Saved to: ${savedPath}` }
      }
      return { success: false }
    } catch (error) {
      return {
        success: false,
        message: `Failed to save WSB configuration: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }

  async saveConfigAs(): Promise<{ success: boolean; message?: string }> {
    try {
      const content = this.serializeConfig()
      const savedPath = await window.api.saveWsbAs(content)
      if (savedPath) {
        this.currentFilePath = savedPath
        this.savedConfig = JSON.stringify(this.config)
        return { success: true, message: `Saved to: ${savedPath}` }
      }
      return { success: false }
    } catch (error) {
      return {
        success: false,
        message: `Failed to save WSB configuration: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }
}

export const documentStore = new DocumentStore()
