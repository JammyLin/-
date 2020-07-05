export default [
  {
    icon: 'mdi-chart-bar',
    title: '报表面板',
    to: '/dashboard',
    role: [1, 2, 3, 4]
  },
  {
    icon: 'mdi-warehouse',
    title: '仓库信息管理',
    children: [
      {
        title: '仓库管理',
        to: '/warehouse',
        role: [3, 4]
      },
      {
        title: '库区管理',
        to: '/reservoir',
        role: [3, 4]
      }
    ]
  },
  {
    icon: 'mdi-package-variant-closed',
    title: '货物管理',
    children: [
      {
        title: '物流管理',
        to: '/logistics',
        role: [2]
      },
      {
        title: '出入管理',
        to: '/storage',
        role: [2]
      }
    ]
  },
  {
    icon: 'mdi-truck-delivery',
    title: '快递管理',
    children: [
      {
        title: '快递分配',
        to: '/delivery/assign',
        role: [2]
      },
      {
        title: '工作清单',
        to: '/delivery/work',
        role: [1]
      }
    ]
  },
  {
    icon: 'mdi-car',
    title: '车辆管理',
    to: '/vehicle',
    role: [3]
  },
  {
    icon: 'mdi-book',
    title: '日志记录',
    children: [
      {
        title: '用户操作日志',
        to: '/log/operation',
        role: [3, 4]
      },
      {
        title: '系统登录日志',
        to: '/log/user',
        role: [3, 4]
      }
    ]
  },
  {
    icon: 'mdi-cog',
    title: '系统管理',
    children: [
      {
        title: '用户管理',
        to: '/user',
        role: [3, 4]
      }
    ]
  }
]
