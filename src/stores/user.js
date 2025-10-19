import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false,
    userInfo: {
      id: null,
      username: '',
      email: '',
      phone: '',
      avatarId: null,
      avatarUrl: '',
      role: null,
      status: false,
      createTime: '',
      updateTime: '',
      points: 0
    },
    token: localStorage.getItem('token') || ''
  }),

  getters: {
    getUserInfo: (state) => state.userInfo,
    getToken: (state) => state.token,
    // 获取头像URL（兼容旧字段名avatar）
    getAvatar: (state) => state.userInfo.avatarUrl || state.userInfo.avatar || '',
    // 判断是否为管理员
    isAdmin: (state) => state.userInfo.role === 0
  },

  actions: {
    // 登录
    login(userInfo, token) {
      this.isLogin = true
      // 合并用户信息，保留所有后端返回的字段
      this.userInfo = {
        id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        phone: userInfo.phone,
        avatarId: userInfo.avatarId,
        avatarUrl: userInfo.avatarUrl,
        role: userInfo.role,
        status: userInfo.status,
        createTime: userInfo.createTime,
        updateTime: userInfo.updateTime,
        points: userInfo.points || 0
      }
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      
      console.log('✅ 用户登录成功，信息已保存：', this.userInfo)
    },

    // 退出登录
    logout() {
      this.isLogin = false
      this.userInfo = {
        id: null,
        username: '',
        email: '',
        phone: '',
        avatarId: null,
        avatarUrl: '',
        role: null,
        status: false,
        createTime: '',
        updateTime: '',
        points: 0
      }
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      console.log('✅ 用户已退出登录')
    },

    // 更新用户信息
    updateUserInfo(userInfo) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      console.log('✅ 用户信息已更新：', this.userInfo)
    },

    // 初始化用户信息（从本地存储恢复）
    initUserInfo() {
      const token = localStorage.getItem('token')
      const userInfo = localStorage.getItem('userInfo')
      
      if (token && userInfo) {
        this.isLogin = true
        this.token = token
        this.userInfo = JSON.parse(userInfo)
        console.log('✅ 用户信息已从缓存恢复：', this.userInfo)
      }
    }
  }
})

