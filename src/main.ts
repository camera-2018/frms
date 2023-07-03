import { createApp } from 'vue'
import './style.css'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { createPinia } from 'pinia'
import ArcoVue from '@arco-design/web-vue'
import App from './App.vue'
import { Guards } from './route'
import '@arco-design/web-vue/dist/arco.css'

const router = createRouter({
  history: createWebHistory(),
})
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(ArcoVue)
app.mount('#app')
Guards(router)
