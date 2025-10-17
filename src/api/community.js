import request from './request'

/**
 * 每日签到
 */
export function checkIn() {
  return request({
    url: '/community/checkin',
    method: 'post'
  })
}

/**
 * 获取签到信息
 */
export function getCheckInInfo() {
  return request({
    url: '/community/checkin/info',
    method: 'get'
  })
}

/**
 * 获取帖子列表
 */
export function getPostList(params) {
  return request({
    url: '/community/posts',
    method: 'get',
    params
  })
}

/**
 * 获取帖子详情
 */
export function getPostDetail(id) {
  return request({
    url: `/community/post/${id}`,
    method: 'get'
  })
}

/**
 * 发表帖子
 */
export function createPost(data) {
  return request({
    url: '/community/post',
    method: 'post',
    data
  })
}

/**
 * 回复帖子
 */
export function replyPost(data) {
  return request({
    url: '/community/reply',
    method: 'post',
    data
  })
}

/**
 * 获取排行榜
 */
export function getRanking(params) {
  return request({
    url: '/community/ranking',
    method: 'get',
    params
  })
}

/**
 * 获取积分任务
 */
export function getPointsTasks() {
  return request({
    url: '/community/points/tasks',
    method: 'get'
  })
}

/**
 * 领取任务奖励
 */
export function claimTaskReward(taskId) {
  return request({
    url: `/community/points/claim/${taskId}`,
    method: 'post'
  })
}

/**
 * 获取社区活动
 */
export function getCommunityActivities(params) {
  return request({
    url: '/community/activities',
    method: 'get',
    params
  })
}

