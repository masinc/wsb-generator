<script lang="ts">
  import type { WsbConfiguration } from '@jsr/masinc__wsb'
  import { CircleQuestionMark } from 'lucide-svelte'
  import PathAutocomplete from '../PathAutocomplete.svelte'

  interface Props {
    config: WsbConfiguration
    currentFilePath: string | null
  }

  let { config = $bindable(), currentFilePath }: Props = $props()

  function addMappedFolder(): void {
    const folders = Array.isArray(config.MappedFolders?.MappedFolder)
      ? config.MappedFolders.MappedFolder
      : config.MappedFolders?.MappedFolder
        ? [config.MappedFolders.MappedFolder]
        : []

    config.MappedFolders = {
      MappedFolder: [...folders, { HostFolder: '', ReadOnly: 'false' }]
    }
  }

  function removeMappedFolder(index: number): void {
    const folders = Array.isArray(config.MappedFolders?.MappedFolder)
      ? config.MappedFolders.MappedFolder
      : config.MappedFolders?.MappedFolder
        ? [config.MappedFolders.MappedFolder]
        : []

    config.MappedFolders = {
      MappedFolder: folders.filter((_, i) => i !== index)
    }
  }

  function getDirname(filePath: string): string {
    const normalized = filePath.replace(/\\/g, '/')
    const lastSlash = normalized.lastIndexOf('/')
    return lastSlash > 0 ? filePath.substring(0, lastSlash) : filePath
  }

  async function selectHostFolder(index: number): Promise<void> {
    const defaultPath = currentFilePath ? getDirname(currentFilePath) : undefined
    const folderPath = await window.api.selectFolder(defaultPath)
    if (folderPath) {
      const folders = Array.isArray(config.MappedFolders?.MappedFolder)
        ? config.MappedFolders.MappedFolder
        : config.MappedFolders?.MappedFolder
          ? [config.MappedFolders.MappedFolder]
          : []
      folders[index].HostFolder = folderPath
    }
  }

  let mappedFolders = $derived(
    Array.isArray(config.MappedFolders?.MappedFolder)
      ? config.MappedFolders.MappedFolder
      : config.MappedFolders?.MappedFolder
        ? [config.MappedFolders.MappedFolder]
        : []
  )
</script>

<div class="card bg-base-200">
  <div class="card-body p-4">
    <div class="flex justify-between items-center mb-2">
      <h2 class="card-title text-lg">Mapped Folders</h2>
      <button class="btn btn-xs btn-primary" onclick={addMappedFolder}>Add</button>
    </div>

    <div class="space-y-2">
      {#each mappedFolders as folder, index (index)}
        <div class="border border-base-300 p-3 rounded">
          <div class="space-y-2">
            <div class="form-control">
              <label class="label py-1" for="host-folder-{index}">
                <span class="label-text text-sm flex items-center gap-1">
                  Host Folder
                  <span
                    class="tooltip"
                    data-tip="Folder on host machine to share into sandbox.;The folder must already exist."
                  >
                    <CircleQuestionMark size={16} class="opacity-60" />
                  </span>
                </span>
              </label>
              <div class="flex gap-2">
                <PathAutocomplete
                  id="host-folder-{index}"
                  bind:value={folder.HostFolder}
                  placeholder="Type or select folder..."
                  {currentFilePath}
                />
                <button class="btn btn-sm btn-outline" onclick={() => selectHostFolder(index)}>
                  Browse
                </button>
              </div>
            </div>

            <div class="form-control">
              <label class="label py-1" for="sandbox-folder-{index}">
                <span class="label-text text-sm flex items-center gap-1">
                  Sandbox Folder (Optional)
                  <span
                    class="tooltip"
                    data-tip="Destination in sandbox to map the folder to.;If folder doesn't exist, it will be created."
                  >
                    <CircleQuestionMark size={16} class="opacity-60" />
                  </span>
                </span>
              </label>
              <input
                id="sandbox-folder-{index}"
                type="text"
                class="input input-sm input-bordered placeholder:opacity-50"
                bind:value={folder.SandboxFolder}
                placeholder="(Optional)"
              />
            </div>

            <div class="flex justify-between items-center">
              <label class="label cursor-pointer gap-2 p-0">
                <span class="label-text text-sm flex items-center gap-1">
                  Read Only
                  <span
                    class="tooltip"
                    data-tip="Enforces read-only access to the shared folder.;Default: false"
                  >
                    <CircleQuestionMark size={16} class="opacity-60" />
                  </span>
                </span>
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  checked={folder.ReadOnly === 'true'}
                  onchange={(e) => {
                    folder.ReadOnly = e.currentTarget.checked ? 'true' : 'false'
                  }}
                />
              </label>

              <button class="btn btn-xs btn-error" onclick={() => removeMappedFolder(index)}>
                Remove
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
