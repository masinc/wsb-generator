<script lang="ts">
  import type { WsbConfiguration } from '@jsr/masinc__wsb'
  import BasicSettings from './settings/BasicSettings.svelte'
  import PermissionsSettings from './settings/PermissionsSettings.svelte'
  import MappedFoldersSettings from './settings/MappedFoldersSettings.svelte'
  import LogonCommandSettings from './settings/LogonCommandSettings.svelte'

  interface Props {
    config: WsbConfiguration
  }

  let { config = $bindable() }: Props = $props()
</script>

<div class="space-y-3">
  <BasicSettings bind:config />
  <PermissionsSettings bind:config />
  <MappedFoldersSettings bind:config />
  <LogonCommandSettings bind:config />
</div>
