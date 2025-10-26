<script lang="ts">
  import type { WsbConfiguration } from '@jsr/masinc__wsb'
  import { CircleQuestionMark } from 'lucide-svelte'

  interface Props {
    config: WsbConfiguration
  }

  let { config = $bindable() }: Props = $props()

  // AudioInput: Default = Enable
  function getAudioInputSelectClass(value: string | undefined): string {
    if (value === 'Enable' || value === 'Default') return 'select-success'
    if (value === 'Disable') return 'select-error'
    return ''
  }

  // VideoInput: Default = Disable
  function getVideoInputSelectClass(value: string | undefined): string {
    if (value === 'Enable') return 'select-success'
    if (value === 'Disable' || value === 'Default') return 'select-error'
    return ''
  }

  // PrinterRedirection: Default = Disable
  function getPrinterRedirectionSelectClass(value: string | undefined): string {
    if (value === 'Enable') return 'select-success'
    if (value === 'Disable' || value === 'Default') return 'select-error'
    return ''
  }

  // ClipboardRedirection: Default = Enable
  function getClipboardRedirectionSelectClass(value: string | undefined): string {
    if (value === 'Enable' || value === 'Default') return 'select-success'
    if (value === 'Disable') return 'select-error'
    return ''
  }

  // ProtectedClient: Default = Disable
  function getProtectedClientSelectClass(value: string | undefined): string {
    if (value === 'Enable') return 'select-success'
    if (value === 'Disable' || value === 'Default') return 'select-error'
    return ''
  }
</script>

<div class="card bg-base-200">
  <div class="card-body p-4">
    <h2 class="card-title text-lg mb-2">Permissions</h2>

    <div class="grid grid-cols-2 gap-3">
      <div class="form-control">
        <label class="label py-1" for="audio-input-select">
          <span class="label-text text-sm flex items-center gap-1">
            Audio Input
            <span class="tooltip" data-tip="Microphone access.;Default: Enable">
              <CircleQuestionMark size={16} class="opacity-60" />
            </span>
          </span>
        </label>
        <select
          id="audio-input-select"
          class="select select-sm select-bordered {getAudioInputSelectClass(config.AudioInput)}"
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
            <span class="tooltip" data-tip="Webcam access.;Default: Disable">
              <CircleQuestionMark size={16} class="opacity-60" />
            </span>
          </span>
        </label>
        <select
          id="video-input-select"
          class="select select-sm select-bordered {getVideoInputSelectClass(config.VideoInput)}"
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
            <span class="tooltip" data-tip="Share host printers with sandbox.&#10;Default: Disable">
              <CircleQuestionMark size={16} class="opacity-60" />
            </span>
          </span>
        </label>
        <select
          id="printer-redirection-select"
          class="select select-sm select-bordered {getPrinterRedirectionSelectClass(
            config.PrinterRedirection
          )}"
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
              data-tip="Share clipboard between host and sandbox.&#10;Default: Enable"
            >
              <CircleQuestionMark size={16} class="opacity-60" />
            </span>
          </span>
        </label>
        <select
          id="clipboard-redirection-select"
          class="select select-sm select-bordered {getClipboardRedirectionSelectClass(
            config.ClipboardRedirection
          )}"
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
            <span
              class="tooltip"
              data-tip="Runs sandbox inside an AppContainer Isolation execution environment for enhanced security.&#10;Default: Disable"
            >
              <CircleQuestionMark size={16} class="opacity-60" />
            </span>
          </span>
        </label>
        <select
          id="protected-client-select"
          class="select select-sm select-bordered {getProtectedClientSelectClass(
            config.ProtectedClient
          )}"
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
