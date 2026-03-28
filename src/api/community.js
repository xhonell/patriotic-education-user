import request from './request'

/**
 * 今日签到
 */
export function signToday() {
  return request({
    url: '/server/sign/today',
    method: 'get'
  })
}

/**
 * 获取本月签到记录（返回签到日期数组）
 */
export function signMonth() {
  return request({
    url: '/server/sign/month',
    method: 'get'
  })
}

/**
 * 话题分页
 */
export function getTopicPage(data) {
  return request({
    url: '/server/topic/page',
    method: 'post',
    data
  })
}

/**
 * 话题详情
 */
export function getTopicDetail(id) {
  return request({
    url: `/server/topic/${id}`,
    method: 'get'
  })
}

/**
 * 发布话题
 */
export function publishTopic(data) {
  return request({
    url: '/server/topic/publish',
    method: 'post',
    data
  })
}

/**
 * 发布话题评论
 */
export function publishTopicComment(data) {
  return request({
    url: '/server/topic/comment/publish',
    method: 'post',
    data
  })
}

/**
 * 删除话题评论
 */
export function deleteTopicComment(id) {
  return request({
    url: `/server/topic/comment/${id}`,
    method: 'delete'
  })
}

/**
 * 获取话题评论分页
 */
export function getTopicCommentPage(data) {
  return request({
    url: '/server/topic/comment/page',
    method: 'post',
    data
  })
}

/**
 * 获取积分排行榜
 */
export function getPointsRanking(params) {
  return request({
    url: '/server/common/points/ranking',
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
 * 获取系统最新动态
 */
export function getLatestActivities() {
  return request({
    url: '/server/common/activities',
    method: 'get'
  })
}

