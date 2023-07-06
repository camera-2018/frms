import { createApp } from 'vue'
import './style.css'

// @ts-expect-error suppress type error beacuse of no type definition
import { createRouter, createWebHistory } from 'vue-router/auto'
import App from './App.vue'
import { Guards } from './route'
import '@arco-design/web-vue/dist/arco.css'
import store from './store'

const router = createRouter({
  history: createWebHistory(),
})

const app = createApp(App)
app.use(router)
Guards(router)
app.use(store)
// app.use(ArcoVue)
app.mount('#app')
