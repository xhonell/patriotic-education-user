import request from './request'

/**
 * 用户登录
 * @param {Object} data - 登录数据
 * @param {String} data.email - 邮箱
 * @param {String} data.password - 密码（6-20位）
 * @returns {Promise} 返回token
 */
export function login(data) {
  return request({
    url: '/server/login/login',
    method: 'post',
    data
  })
}

/**
 * 用户注册
 * @param {Object} data - 注册数据
 * @param {Number} data.avatarId - 头像文件ID
 * @param {String} data.username - 用户名
 * @param {String} data.email - 邮箱
 * @param {String} data.phone - 手机号
 * @param {String} data.code - 邮箱验证码
 * @param {String} data.password - 密码
 */
export function register(data) {
  return request({
    url: '/server/login/register',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request({
    url: '/server/login/info',
    method: 'get'
  })
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

/**
 * 获取学习历史
 */
export function getLearningHistory(params) {
  return request({
    url: '/user/learning/history',
    method: 'get',
    params
  })
}

/**
 * 获取积分明细
 */
export function getPointsHistory(params) {
  return request({
    url: '/user/points/history',
    method: 'get',
    params
  })
}

/**
 * 发送注册邮箱验证码
 */
export function sendRegisterCode(email) {
  return request({
    url: '/server/login/sendRegisterCode',
    method: 'post',
    params: {
      email
    }
  })
}

/**
 * 上传文件
 */
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/server/common/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

