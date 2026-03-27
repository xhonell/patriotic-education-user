import request from './request'

/**
 * 点赞/取消点赞
 * @param {{contentId: number, operation: 1|0}} data
 */
export function handleLike(data) {
  return request({
    url: '/server/interaction/like',
    method: 'post',
    data
  })
}

/**
 * 收藏/取消收藏
 * @param {{contentId: number, operation: 1|0}} data
 */
export function handleCollect(data) {
  return request({
    url: '/server/interaction/collect',
    method: 'post',
    data
  })
}

/**
 * 获取内容互动状态（是否已点赞/收藏）
 * @param {{contentId: number}} data
 */
export function getInteractionStatus(data) {
  return request({
    url: '/server/interaction/status',
    method: 'post',
    data
  })
}
