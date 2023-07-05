import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { Message } from '@arco-design/web-vue'
import { base_url } from '../utils/config'
import store from '.'

const useUserStore = defineStore('user', {
  state: () => {
    return {
      login: false,
      role: '',
    }
  },
  actions: {
    async setLogin(account: string, password: string) {
      const resp = await fetch(`${base_url}/login`, {
        body: JSON.stringify({
          account,
          password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      const data = await resp.json()
      if (data.code === 20000) {
        useStorage('token', data.data.token)
        this.login = true
        this.role = (JSON.parse(atob(data.data.token.split('.')[1]))).role
        Message.success('登录成功')
        return true
      }
      else {
        Message.error('登录失败')
        return false
      }
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
