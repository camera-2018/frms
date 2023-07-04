import { defineStore } from 'pinia'
import store from '.'

const useAppStore = defineStore('app', {
  state: () => {
    return {
      loading: false,
    }
  },
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },
  },
})

const watchDog = useAppStore(store)
watchDog.$subscribe((_, state) => {
  localStorage.app_store = JSON.stringify(state)
})
if (localStorage.app_store)
  watchDog.$state = JSON.parse(localStorage.app_store)

export default useAppStore
