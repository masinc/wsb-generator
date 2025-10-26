<script lang="ts">
  import type { WsbConfiguration } from '@jsr/masinc__wsb'
  import { HelpCircle } from 'lucide-svelte'

  interface Props {
    config: WsbConfiguration
  }

  let { config = $bindable() }: Props = $props()
</script>

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
