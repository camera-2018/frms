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
    title: '记录管理',
    key: '/',
    sub: [],
  },
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
      key: '/user/profile',
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
      key: '/user/profile',
    }],
  },
]

export function sendroute() {
  return menu_for_user
}
