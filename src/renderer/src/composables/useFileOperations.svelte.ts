export function useFileOperations(
  store: typeof import('../stores/documentStore.svelte').documentStore
) {
  let errorMessage = $state<string | null>(null)
  let successMessage = $state<string | null>(null)

  async function confirmUnsavedChanges(): Promise<boolean> {
    if (!store.isModified) return true

    const confirmed = await window.api.showConfirmDialog('Do you want to discard unsaved changes?')
    return confirmed
  }

  function setupMenuHandlers(): void {
    window.api.onMenuNew(async () => {
      if (await confirmUnsavedChanges()) {
        store.newConfig()
        successMessage = null
        errorMessage = null
      }
    })

    window.api.onMenuOpen(async () => {
      if (await confirmUnsavedChanges()) {
        const result = await store.loadConfig()
        if (result.success) {
          successMessage = result.message || null
          errorMessage = null
        } else {
          errorMessage = result.message || null
          successMessage = null
        }
      }
    })

    window.api.onMenuSave(async () => {
      const result = await store.saveConfig()
      if (result.success) {
        successMessage = result.message || null
        errorMessage = null
      } else {
        errorMessage = result.message || null
        successMessage = null
      }
    })

    window.api.onMenuSaveAs(async () => {
      const result = await store.saveConfigAs()
      if (result.success) {
        successMessage = result.message || null
        errorMessage = null
      } else {
        errorMessage = result.message || null
        successMessage = null
      }
    })

    window.api.onBeforeClose(async () => {
      const canClose = await confirmUnsavedChanges()
      window.api.confirmClose(canClose)
    })
  }

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
        if (!(await confirmUnsavedChanges())) {
          return
        }
        try {
          const filePath = await window.api.getFilePath(file)
          if (filePath) {
            const result = await store.loadConfigFromPath(filePath)
            if (result.success) {
              successMessage = result.message || null
              errorMessage = null
            } else {
              errorMessage = result.message || 'Unable to get file path'
              successMessage = null
            }
          } else {
            errorMessage = 'Unable to get file path'
            successMessage = null
          }
        } catch (error) {
          errorMessage = `Failed to get file path: ${error instanceof Error ? error.message : String(error)}`
          successMessage = null
        }
      } else {
        errorMessage = 'Please drop a .wsb file'
        successMessage = null
      }
    }
  }

  function clearError(): void {
    errorMessage = null
  }

  function clearSuccess(): void {
    successMessage = null
  }

  return {
    get errorMessage() {
      return errorMessage
    },
    get successMessage() {
      return successMessage
    },
    setupMenuHandlers,
    handleDragOver,
    handleDrop,
    clearError,
    clearSuccess
  }
}
