import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false,
    userInfo: {
      id: null,
      username: '',
      email: '',
      avatar: '',
      phone: '',
      points: 0
    },
    token: localStorage.getItem('token') || ''
  }),

  getters: {
    getUserInfo: (state) => state.userInfo,
    getToken: (state) => state.token
  },

  actions: {
    // 登录
    login(userInfo, token) {
      this.isLogin = true
      this.userInfo = userInfo
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },

    // 退出登录
    logout() {
      this.isLogin = false
      this.userInfo = {
        id: null,
        username: '',
        email: '',
        avatar: '',
        phone: '',
        points: 0
      }
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    },

    // 更新用户信息
    updateUserInfo(userInfo) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },

    // 初始化用户信息（从本地存储恢复）
    initUserInfo() {
      const token = localStorage.getItem('token')
      const userInfo = localStorage.getItem('userInfo')
      
      if (token && userInfo) {
        this.isLogin = true
        this.token = token
        this.userInfo = JSON.parse(userInfo)
      }
    }
  }
})

