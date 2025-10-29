type Theme = 'light' | 'dark' | 'system'

class ThemeStore {
  theme = $state<Theme>('system')
  private initialized = false

  async initialize(): Promise<void> {
    if (this.initialized) return

    // Load theme from electron-store
    const savedTheme = await window.api.getTheme()
    this.theme = savedTheme
    this.applyTheme()
    this.watchSystemTheme()
    this.initialized = true
  }

  async setTheme(newTheme: Theme): Promise<void> {
    this.theme = newTheme
    await window.api.setTheme(newTheme)
    this.applyTheme()
  }

  private applyTheme(): void {
    const effectiveTheme = this.getEffectiveTheme()
    document.documentElement.setAttribute('data-theme', effectiveTheme)
  }

  private getEffectiveTheme(): 'light' | 'dark' {
    if (this.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return this.theme
  }

  private watchSystemTheme(): void {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    darkModeQuery.addEventListener('change', () => {
      // Only auto-update when theme is set to 'system'
      if (this.theme === 'system') {
        this.applyTheme()
      }
    })
  }
}

export const themeStore = new ThemeStore()
