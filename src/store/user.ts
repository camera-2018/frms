import { defineStore } from 'pinia'
import store from '.'

const useUserStore = defineStore('user', {
  state: () => {
    return {
      login: false,
    }
  },
  actions: {
    async setLogin(login: boolean) {
      this.login = login
    },
  },
})

const watchDog = useUserStore(store)
watchDog.$subscribe((_, state) => {
  localStorage.user_store = JSON.stringify(state)
})
if (localStorage.user_store)
  watchDog.$state = JSON.parse(localStorage.user_store)

export default useUserStore
