import request from './request'

/**
 * 发布评论
 */
export function publishComment(data) {
  return request({
    url: '/server/comment/publish',
    method: 'post',
    data
  })
}

/**
 * 删除评论
 */
export function deleteComment(id) {
  return request({
    url: `/server/comment/${id}`,
    method: 'delete'
  })
}

/**
 * 评论分页
 */
export function getCommentPage(data) {
  return request({
    url: '/server/comment/page',
    method: 'post',
    data
  })
}

