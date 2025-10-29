<script lang="ts">
  import NotificationToast from './components/NotificationToast.svelte'
  import SettingsForm from './components/SettingsForm.svelte'
  import { documentStore } from './stores/documentStore.svelte'
  import { themeStore } from './stores/themeStore.svelte'
  import { useFileOperations } from './composables/useFileOperations.svelte'

  const fileOps = useFileOperations(documentStore)

  // Setup handlers
  fileOps.setupMenuHandlers()

  // Initialize theme
  themeStore.initialize()

  // Handle theme changes from menu
  window.api.onMenuThemeChange((theme) => {
    themeStore.setTheme(theme)
  })

  // Update window title when file path or modified state changes
  $effect(() => {
    const fileName = documentStore.currentFilePath || 'Untitled'
    const modifiedIndicator = documentStore.isModified ? '*' : ''
    const title = `${modifiedIndicator}${fileName} - WSB Configuration`
    window.api.setTitle(title)
  })
</script>

<div
  class="container mx-auto p-4 max-w-2xl"
  role="application"
  ondragover={fileOps.handleDragOver}
  ondrop={fileOps.handleDrop}
>
  <SettingsForm
    bind:config={documentStore.config}
    currentFilePath={documentStore.currentFilePath}
  />
</div>

<NotificationToast
  errorMessage={fileOps.errorMessage}
  successMessage={fileOps.successMessage}
  onClearError={fileOps.clearError}
  onClearSuccess={fileOps.clearSuccess}
/>
