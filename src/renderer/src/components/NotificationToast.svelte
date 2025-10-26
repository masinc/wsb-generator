<script lang="ts">
  interface Props {
    errorMessage: string | null
    successMessage: string | null
    onClearError?: () => void
    onClearSuccess?: () => void
  }

  let { errorMessage, successMessage, onClearError, onClearSuccess }: Props = $props()
</script>

<div class="fixed top-4 right-4 z-50 space-y-2 max-w-md">
  {#if errorMessage}
    <div class="alert alert-error shadow-lg">
      <span>{errorMessage}</span>
      <button class="btn btn-sm btn-ghost" onclick={onClearError}>✕</button>
    </div>
  {/if}

  {#if successMessage}
    <div class="alert alert-success shadow-lg">
      <span>{successMessage}</span>
      <button class="btn btn-sm btn-ghost" onclick={onClearSuccess}>✕</button>
    </div>
  {/if}
</div>
