import Store from 'electron-store'

export type Theme = 'light' | 'dark' | 'system'

type StoreSchema = {
  theme: Theme
}

export const store = new Store<StoreSchema>({
  defaults: {
    theme: 'system'
  }
})
