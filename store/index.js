export const state = () => ({
  user: {}
})

export const mutations = {
  USERLOGIN(state, user) {
    state.user = user
    // 存储登陆信息
    if (process.client) {
      window.sessionStorage.setItem('user', JSON.stringify(user))
    }
  },
  USEREXIT(state) {
    state.user = {}
    if (process.client) {
      window.sessionStorage.removeItem('user')
    }
  }
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.user) {
      const user = req.user
      commit('USERLOGIN', user)
    }
  },
  // 用户登录
  userlogin({ commit }, data) {
    commit('USERLOGIN', data)
  },
  // 用户退出
  userexit({ commit }) {
    commit('USEREXIT')
  }
}

export const getters = {
  getRoleType: (state) => {
    return state.user.role_type
  },
  getWarehouseId: (state) => {
    return state.user.warehouse_id
  },
  getVehicle: (state) => {
    return state.user.vehicle
  },
  getRealName: (state) => {
    return state.user.real_name
  }
}
