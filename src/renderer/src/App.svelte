<script lang="ts">
  import type { WsbConfiguration } from '@jsr/masinc__wsb'
  import { parse, serialize } from '@jsr/masinc__wsb'
  import NotificationToast from './components/NotificationToast.svelte'
  import SettingsForm from './components/SettingsForm.svelte'

  let config = $state<WsbConfiguration>({
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

  let currentFilePath = $state<string | null>(null)
  let errorMessage = $state<string | null>(null)
  let successMessage = $state<string | null>(null)

  // Update window title when file path changes
  $effect(() => {
    const title = currentFilePath ? `${currentFilePath} - WSB Configuration` : 'WSB Configuration'
    window.api.setTitle(title)
  })

  // Setup menu handlers
  window.api.onMenuNew(() => {
    newConfig()
  })

  window.api.onMenuOpen(() => {
    loadConfig()
  })

  window.api.onMenuSave(() => {
    saveConfig()
  })

  window.api.onMenuSaveAs(() => {
    saveConfigAs()
  })

  // Drag and drop handlers
  function handleDragOver(event: DragEvent): void {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }
  }

  async function handleDrop(event: DragEvent): Promise<void> {
    event.preventDefault()
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0]
      if (file.name.toLowerCase().endsWith('.wsb')) {
        try {
          const filePath = await window.api.getFilePath(file)
          if (filePath) {
            await loadConfigFromPath(filePath)
          } else {
            errorMessage = 'Unable to get file path'
          }
        } catch (error) {
          errorMessage = `Failed to get file path: ${error instanceof Error ? error.message : String(error)}`
        }
      } else {
        errorMessage = 'Please drop a .wsb file'
      }
    }
  }

  async function loadConfigFromPath(filePath: string): Promise<void> {
    errorMessage = null
    successMessage = null
    try {
      const content = await window.api.loadWsbFromPath(filePath)
      if (content) {
        const parsed = parse(content)
        config = {
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
        currentFilePath = filePath
        successMessage = `Loaded: ${filePath}`
      }
    } catch (error) {
      errorMessage = `Failed to load WSB file: ${error instanceof Error ? error.message : String(error)}`
    }
  }

  function newConfig(): void {
    config = {
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
    currentFilePath = null
    errorMessage = null
    successMessage = null
  }

  async function loadConfig(): Promise<void> {
    errorMessage = null
    successMessage = null
    const result = await window.api.loadWsb()
    if (result) {
      try {
        const parsed = parse(result.content)
        // Fill in missing fields with 'Default'
        config = {
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
        currentFilePath = result.filePath
        successMessage = `Loaded: ${result.filePath}`
      } catch (error) {
        errorMessage = `Failed to parse WSB file: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }

  function serializeConfig(): string {
    // Remove 'Default' values before serialization (Default means unspecified)
    const cleanConfig: WsbConfiguration = {}
    if (config.VGpu && config.VGpu !== 'Default') cleanConfig.VGpu = config.VGpu
    if (config.Networking && config.Networking !== 'Default')
      cleanConfig.Networking = config.Networking
    if (config.AudioInput && config.AudioInput !== 'Default')
      cleanConfig.AudioInput = config.AudioInput
    if (config.VideoInput && config.VideoInput !== 'Default')
      cleanConfig.VideoInput = config.VideoInput
    if (config.ProtectedClient && config.ProtectedClient !== 'Default')
      cleanConfig.ProtectedClient = config.ProtectedClient
    if (config.PrinterRedirection && config.PrinterRedirection !== 'Default')
      cleanConfig.PrinterRedirection = config.PrinterRedirection
    if (config.ClipboardRedirection && config.ClipboardRedirection !== 'Default')
      cleanConfig.ClipboardRedirection = config.ClipboardRedirection
    if (config.MemoryInMB) cleanConfig.MemoryInMB = config.MemoryInMB
    if (config.MappedFolders && config.MappedFolders.MappedFolder) {
      const folders = Array.isArray(config.MappedFolders.MappedFolder)
        ? config.MappedFolders.MappedFolder
        : [config.MappedFolders.MappedFolder]
      if (folders.length > 0) cleanConfig.MappedFolders = config.MappedFolders
    }
    if (config.LogonCommand && config.LogonCommand.Command)
      cleanConfig.LogonCommand = config.LogonCommand

    return serialize({ Configuration: cleanConfig })
  }

  async function saveConfig(): Promise<void> {
    errorMessage = null
    successMessage = null
    try {
      const content = serializeConfig()
      const savedPath = await window.api.saveWsb(content, currentFilePath || undefined)
      if (savedPath) {
        currentFilePath = savedPath
        successMessage = `Saved to: ${savedPath}`
      }
    } catch (error) {
      errorMessage = `Failed to save WSB configuration: ${error instanceof Error ? error.message : String(error)}`
    }
  }

  async function saveConfigAs(): Promise<void> {
    errorMessage = null
    successMessage = null
    try {
      const content = serializeConfig()
      const savedPath = await window.api.saveWsbAs(content)
      if (savedPath) {
        currentFilePath = savedPath
        successMessage = `Saved to: ${savedPath}`
      }
    } catch (error) {
      errorMessage = `Failed to save WSB configuration: ${error instanceof Error ? error.message : String(error)}`
    }
  }
</script>

<div
  class="container mx-auto p-4 max-w-2xl"
  role="application"
  ondragover={handleDragOver}
  ondrop={handleDrop}
>
  <SettingsForm bind:config {currentFilePath} />
</div>

<NotificationToast
  {errorMessage}
  {successMessage}
  onClearError={() => (errorMessage = null)}
  onClearSuccess={() => (successMessage = null)}
/>
