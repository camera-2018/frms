import useUserStore from '../store/user'

const menu_for_user = [
  {
    title: '我的报修',
    key: '/list',
    sub: [],
  },
  {
    title: '我要报修',
    key: '/fix',
    sub: [],
  },
  {
    title: '我的信息',
    key: '',
    sub: [{
      title: '个人信息维护',
      key: '/user/info',
    }],
  },
]

const menu_for_administrator = [
  {
    title: '任务委派',
    key: '/tasklist',
    sub: [],
  },
  {
    title: '我的信息',
    key: '',
    sub: [{
      title: '个人信息维护',
      key: '/user/info',
    }],
  },
]

const menu_for_worker = [
  {
    title: '我的维修',
    key: '/list',
    sub: [],
  },
  {
    title: '我的信息',
    key: '',
    sub: [{
      title: '个人信息维护',
      key: '/user/info',
    }],
  },
]

export function sendroute() {
  if (useUserStore().role === 'admin')
    return menu_for_administrator
  if (useUserStore().role === 'user')
    return menu_for_user
  if (useUserStore().role === 'worker')
    return menu_for_worker
  else
    return menu_for_user
}
