<script lang="ts">
  import type { WsbConfiguration } from '@jsr/masinc__wsb'
  import { HelpCircle } from 'lucide-svelte'

  interface Props {
    config: WsbConfiguration
  }

  let { config = $bindable() }: Props = $props()

  let useCustomMemory = $state(config.MemoryInMB !== undefined)
  let memoryValue = $state(config.MemoryInMB || 4096)

  $effect(() => {
    if (useCustomMemory) {
      config.MemoryInMB = memoryValue
    } else {
      config.MemoryInMB = undefined
    }
  })

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

  function getSelectClass(value: string | undefined): string {
    if (value === 'Enable') return 'select-success'
    if (value === 'Disable') return 'select-error'
    return ''
  }
</script>

<div class="space-y-3">
  <!-- Basic Settings -->
  <div class="card bg-base-200">
    <div class="card-body p-4">
      <h2 class="card-title text-lg mb-2">Basic Settings</h2>

      <div class="grid grid-cols-2 gap-3">
        <div class="form-control">
          <label class="label py-1" for="vgpu-select">
            <span class="label-text text-sm flex items-center gap-1">
              VGpu
              <span class="tooltip" data-tip="GPU virtualization.&#10;Default: Enable if supported">
                <HelpCircle size={16} class="opacity-60" />
              </span>
            </span>
          </label>
          <select
            id="vgpu-select"
            class="select select-sm select-bordered {getSelectClass(config.VGpu)}"
            bind:value={config.VGpu}
          >
            <option value="Default">Default</option>
            <option value="Enable">Enable</option>
            <option value="Disable">Disable</option>
          </select>
        </div>

        <div class="form-control">
          <label class="label py-1" for="networking-select">
            <span class="label-text text-sm flex items-center gap-1">
              Networking
              <span class="tooltip" data-tip="Network access.&#10;Default: Disable">
                <HelpCircle size={16} class="opacity-60" />
              </span>
            </span>
          </label>
          <select
            id="networking-select"
            class="select select-sm select-bordered {getSelectClass(config.Networking)}"
            bind:value={config.Networking}
          >
            <option value="Default">Default</option>
            <option value="Enable">Enable</option>
            <option value="Disable">Disable</option>
          </select>
        </div>

        <div class="form-control col-span-2">
          <label class="label py-1">
            <span class="label-text text-sm flex items-center gap-1">
              Memory (MB)
              <span
                class="tooltip"
                data-tip="Memory allocation in megabytes.&#10;Default: 50% of host memory"
              >
                <HelpCircle size={16} class="opacity-60" />
              </span>
            </span>
          </label>
          <div class="flex gap-2 items-center">
            <label class="label cursor-pointer gap-2 p-0">
              <input
                type="radio"
                name="memory-mode"
                class="radio radio-sm"
                checked={!useCustomMemory}
                onchange={() => (useCustomMemory = false)}
              />
              <span class="label-text text-sm">Default</span>
            </label>
            <label class="label cursor-pointer gap-2 p-0">
              <input
                type="radio"
                name="memory-mode"
                class="radio radio-sm"
                checked={useCustomMemory}
                onchange={() => (useCustomMemory = true)}
              />
              <span class="label-text text-sm">Custom:</span>
            </label>
            <input
              type="number"
              class="input input-sm input-bordered w-24"
              bind:value={memoryValue}
              disabled={!useCustomMemory}
              min="512"
              step="512"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Permissions -->
  <div class="card bg-base-200">
    <div class="card-body p-4">
      <h2 class="card-title text-lg mb-2">Permissions</h2>

      <div class="grid grid-cols-2 gap-3">
        <div class="form-control">
          <label class="label py-1" for="audio-input-select">
            <span class="label-text text-sm flex items-center gap-1">
              Audio Input
              <span class="tooltip" data-tip="Microphone access.&#10;Default: Disable">
                <HelpCircle size={16} class="opacity-60" />
              </span>
            </span>
          </label>
          <select
            id="audio-input-select"
            class="select select-sm select-bordered {getSelectClass(config.AudioInput)}"
            bind:value={config.AudioInput}
          >
            <option value="Default">Default</option>
            <option value="Enable">Enable</option>
            <option value="Disable">Disable</option>
          </select>
        </div>

        <div class="form-control">
          <label class="label py-1" for="video-input-select">
            <span class="label-text text-sm flex items-center gap-1">
              Video Input
              <span class="tooltip" data-tip="Webcam access.&#10;Default: Disable">
                <HelpCircle size={16} class="opacity-60" />
              </span>
            </span>
          </label>
          <select
            id="video-input-select"
            class="select select-sm select-bordered {getSelectClass(config.VideoInput)}"
            bind:value={config.VideoInput}
          >
            <option value="Default">Default</option>
            <option value="Enable">Enable</option>
            <option value="Disable">Disable</option>
          </select>
        </div>

        <div class="form-control">
          <label class="label py-1" for="printer-redirection-select">
            <span class="label-text text-sm flex items-center gap-1">
              Printer
              <span
                class="tooltip"
                data-tip="Share host printers with sandbox.&#10;Default: Disable"
              >
                <HelpCircle size={16} class="opacity-60" />
              </span>
            </span>
          </label>
          <select
            id="printer-redirection-select"
            class="select select-sm select-bordered {getSelectClass(config.PrinterRedirection)}"
            bind:value={config.PrinterRedirection}
          >
            <option value="Default">Default</option>
            <option value="Enable">Enable</option>
            <option value="Disable">Disable</option>
          </select>
        </div>

        <div class="form-control">
          <label class="label py-1" for="clipboard-redirection-select">
            <span class="label-text text-sm flex items-center gap-1">
              Clipboard
              <span
                class="tooltip"
                data-tip="Share clipboard between host and sandbox.&#10;Default: Disable"
              >
                <HelpCircle size={16} class="opacity-60" />
              </span>
            </span>
          </label>
          <select
            id="clipboard-redirection-select"
            class="select select-sm select-bordered {getSelectClass(config.ClipboardRedirection)}"
            bind:value={config.ClipboardRedirection}
          >
            <option value="Default">Default</option>
            <option value="Enable">Enable</option>
            <option value="Disable">Disable</option>
          </select>
        </div>

        <div class="form-control col-span-2">
          <label class="label py-1" for="protected-client-select">
            <span class="label-text text-sm flex items-center gap-1">
              Protected Client
              <span class="tooltip" data-tip="Enhanced security mode.&#10;Default: Disable">
                <HelpCircle size={16} class="opacity-60" />
              </span>
            </span>
          </label>
          <select
            id="protected-client-select"
            class="select select-sm select-bordered {getSelectClass(config.ProtectedClient)}"
            bind:value={config.ProtectedClient}
          >
            <option value="Default">Default</option>
            <option value="Enable">Enable</option>
            <option value="Disable">Disable</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <!-- Mapped Folders -->
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

  <!-- Logon Command -->
  <div class="card bg-base-200">
    <div class="card-body p-4">
      <h2 class="card-title text-lg mb-2">Logon Command</h2>

      <div class="form-control">
        <label class="label py-1" for="logon-command-input">
          <span class="label-text text-sm flex items-center gap-1">
            Command to execute on startup
            <span
              class="tooltip"
              data-tip="Command to run when sandbox starts.&#10;Example: cmd.exe /c start notepad.exe"
            >
              <HelpCircle size={16} class="opacity-60" />
            </span>
          </span>
        </label>
        <input
          id="logon-command-input"
          type="text"
          class="input input-sm input-bordered placeholder:opacity-50"
          bind:value={config.LogonCommand.Command}
          placeholder="(Optional)"
        />
      </div>
    </div>
  </div>
</div>
