import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserStore = defineStore('User', {
  state: () => {
    return {
      login: useStorage('login', false),
    }
  },
  actions: {
    async setLogin(login: boolean) {
      this.login = login
    },
  },
})

export const useLoading = defineStore('Loading', {
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
