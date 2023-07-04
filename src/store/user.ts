import { defineStore } from 'pinia'
import store from '.'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
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
