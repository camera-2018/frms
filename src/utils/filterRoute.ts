import useUserStore from '../store/user'

const user_route = [
  {
    title: '我的报修',
    key: '/list',
    sub: [],
  },
  {
    title: '我要报修',
    key: '/report',
    sub: [],
  },
  {
    title: '我的信息',
    key: '',
    sub: [{
      title: '信息查看',
      key: '/user/info',
    },
    {
      title: '信息修改',
      key: '/user/modify',
    }],
  },
]

const admin_route = [
  {
    title: '任务委派',
    key: '/list',
    sub: [],
  },
  {
    title: '我的信息',
    key: '',
    sub: [{
      title: '信息查看',
      key: '/user/info',
    },
    {
      title: '信息修改',
      key: '/user/modify',
    }],
  },
]

const worker_route = [
  {
    title: '我的维修',
    key: '/list',
    sub: [],
  },
  {
    title: '我的信息',
    key: '',
    sub: [{
      title: '信息查看',
      key: '/user/info',
    },
    {
      title: '信息修改',
      key: '/user/modify',
    }
    ],
  },
]

export function filterRoute() {
  const role = useUserStore().role
  switch (role) {
    case 'admin':
      return admin_route
    case 'user':
      return user_route
    case 'worker':
      return worker_route
    default:
      return []
  }
}
