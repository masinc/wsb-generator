<script lang="ts">
  import type { WsbConfiguration } from '@jsr/masinc__wsb'
  import { HelpCircle } from 'lucide-svelte'

  interface Props {
    config: WsbConfiguration
  }

  let { config = $bindable() }: Props = $props()

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

  async function selectHostFolder(index: number): Promise<void> {
    const folderPath = await window.api.selectFolder()
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
                    data-tip="Path to folder on host machine.&#10;Example: C:\MyFolder"
                  >
                    <HelpCircle size={16} class="opacity-60" />
                  </span>
                </span>
              </label>
              <div class="flex gap-2">
                <input
                  id="host-folder-{index}"
                  type="text"
                  class="input input-sm input-bordered flex-1 placeholder:opacity-50"
                  bind:value={folder.HostFolder}
                  placeholder="Select folder..."
                />
                <button
                  class="btn btn-sm btn-outline"
                  onclick={() => selectHostFolder(index)}
                >
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
                    data-tip="Path inside sandbox (optional).&#10;If empty, uses Desktop."
                  >
                    <HelpCircle size={16} class="opacity-60" />
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
                    data-tip="Prevent modifications to host folder.&#10;Sandbox can only read files."
                  >
                    <HelpCircle size={16} class="opacity-60" />
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
