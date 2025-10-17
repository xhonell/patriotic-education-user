import request from './request'

/**
 * 用户登录
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * 用户注册
 */
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request({
    url: '/user/info',
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
 * 发送验证码
 */
export function sendVerifyCode(data) {
  return request({
    url: '/user/send-code',
    method: 'post',
    data
  })
}

