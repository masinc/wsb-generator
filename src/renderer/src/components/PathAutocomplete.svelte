<script lang="ts">
  interface Props {
    value: string
    placeholder?: string
    id?: string
    currentFilePath?: string | null
    onValueChange?: (value: string) => void
  }

  let {
    value = $bindable(''),
    placeholder = '',
    id = '',
    currentFilePath = null,
    onValueChange
  }: Props = $props()

  let suggestions: string[] = $state([])
  let selectedIndex: number = $state(-1)
  let showSuggestions: boolean = $state(false)
  let inputElement: HTMLInputElement | undefined = $state()
  let debounceTimer: ReturnType<typeof setTimeout> | undefined = $state()

  async function searchDirectories(path: string): Promise<void> {
    try {
      const results = await window.api.searchDirectories(
        path,
        currentFilePath ?? undefined
      )
      suggestions = results
      showSuggestions = results.length > 0
      selectedIndex = -1
    } catch (error) {
      console.error('Failed to search directories:', error)
      suggestions = []
      showSuggestions = false
    }
  }

  function handleInput(): void {
    // Debounce search requests
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      searchDirectories(value)
    }, 150)
  }

  function handleKeydown(e: KeyboardEvent): void {
    if (!showSuggestions) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      selectedIndex = Math.max(selectedIndex - 1, -1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      selectSuggestion(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      showSuggestions = false
      selectedIndex = -1
    } else if (e.key === 'Tab' && selectedIndex >= 0) {
      e.preventDefault()
      selectSuggestion(suggestions[selectedIndex])
    }
  }

  function selectSuggestion(path: string): void {
    value = path
    showSuggestions = false
    selectedIndex = -1
    if (onValueChange) {
      onValueChange(value)
    }
    // Trigger search for subdirectories after selection
    searchDirectories(path + '\\')
  }

  function handleFocus(): void {
    searchDirectories(value)
  }

  function handleBlur(): void {
    // Delay hiding suggestions to allow click events to fire
    setTimeout(() => {
      showSuggestions = false
      selectedIndex = -1
    }, 200)
  }
</script>

<div class="relative flex-1">
  <input
    bind:this={inputElement}
    {id}
    type="text"
    class="input input-sm input-bordered w-full placeholder:opacity-50"
    bind:value
    {placeholder}
    oninput={handleInput}
    onkeydown={handleKeydown}
    onfocus={handleFocus}
    onblur={handleBlur}
    autocomplete="off"
  />

  {#if showSuggestions && suggestions.length > 0}
    <ul
      class="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded shadow-lg max-h-60 overflow-y-auto"
    >
      {#each suggestions as suggestion, index (suggestion)}
        <li>
          <button
            type="button"
            class="w-full text-left px-3 py-2 hover:bg-base-200 text-sm font-mono"
            class:bg-base-200={index === selectedIndex}
            onclick={() => selectSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
