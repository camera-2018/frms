import { storeToRefs } from 'pinia'
import { useUserStore } from '../store'

export function Guards(router: any) {
  router.beforeEach((to: any, from: any, next: any) => {
    const isAuthenticated = checkUserAuthentication()
    if (to.path !== '/login' && !isAuthenticated)
      next({ path: '/login' })
    else next()
  })
}

export function checkUserAuthentication() {
  return storeToRefs(useUserStore()).login.value
}
