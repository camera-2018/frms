import { defineStore } from 'pinia'
import { Message } from '@arco-design/web-vue'
import { base_url } from '../utils/config'
import store from '.'
import { LoginForm, UserState } from '../schema/user'
import { useDateFormat } from '@vueuse/core'

const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => {
    return {
      is_login: false,
      token: "",
      role: "guest",
      _id: undefined,
      account: undefined,
      name: undefined,
      sex: undefined,
      phone: undefined,
      department: undefined,
      job_type: undefined,
      avatar: undefined,
      created_at: undefined,
      updated_at: undefined
    }
  },
  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },
  actions: {
    setInfo(info: Partial<UserState>) {
      this.$patch(info);
    },
    resetInfo() {
      this.$reset();
    },
    async login(loginForm: LoginForm) {
      const resp = await fetch(`${base_url}/login`, {
        body: JSON.stringify(loginForm),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      const payload = await resp.json()

      if (payload.code === 20000) {
        this.is_login = true
        this.token = payload.data.token
        this.role = payload.data.role
        Message.success('登录成功')
        return true
      }
      else {
        Message.error('登录失败')
        return false
      }
    },
    async logout() {
      this.resetInfo();
    },
    async info() {
      const resp = await fetch(`${base_url}/user/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
      })
      const payload = await resp.json()

      this.setInfo(payload.data.user_info)
      this.created_at = useDateFormat(this.created_at, 'YYYY年MM月DD日 HH:mm:ss').value
      this.updated_at = useDateFormat(this.updated_at, 'YYYY年MM月DD日 HH:mm:ss').value
    }
  },
})

const watchDog = useUserStore(store)
watchDog.$subscribe((_, state) => {
  localStorage.user_store = JSON.stringify(state)
})
if (localStorage.user_store)
  watchDog.$state = JSON.parse(localStorage.user_store)

export default useUserStore
