<script lang="ts">
  import type { WsbConfiguration } from '@jsr/masinc__wsb'
  import { CircleQuestionMark } from 'lucide-svelte'

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

  function getSelectClass(value: string | undefined): string {
    if (value === 'Enable') return 'select-success'
    if (value === 'Disable') return 'select-error'
    return ''
  }
</script>

<div class="card bg-base-200">
  <div class="card-body p-4">
    <h2 class="card-title text-lg mb-2">Basic Settings</h2>

    <div class="grid grid-cols-2 gap-3">
      <div class="form-control">
        <label class="label py-1" for="vgpu-select">
          <span class="label-text text-sm flex items-center gap-1">
            VGpu
            <span class="tooltip" data-tip="GPU virtualization.;Default: Enable">
              <CircleQuestionMark size={16} class="opacity-60" />
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
            <span class="tooltip" data-tip="Network access.;Default: Enable">
              <CircleQuestionMark size={16} class="opacity-60" />
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
              data-tip="Memory allocation in megabytes.;Default: 4096 MB (minimum: 2048 MB)"
            >
              <CircleQuestionMark size={16} class="opacity-60" />
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
