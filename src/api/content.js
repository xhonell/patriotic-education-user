import request from './request'

/**
 * 获取文章列表
 */
export function getArticleList(params) {
  return request({
    url: '/content/articles',
    method: 'get',
    params
  })
}

/**
 * 获取文章详情
 */
export function getArticleDetail(id) {
  return request({
    url: `/content/article/${id}`,
    method: 'get'
  })
}

/**
 * 获取视频列表
 */
export function getVideoList(params) {
  return request({
    url: '/content/videos',
    method: 'get',
    params
  })
}

/**
 * 获取视频详情
 */
export function getVideoDetail(id) {
  return request({
    url: `/content/video/${id}`,
    method: 'get'
  })
}

/**
 * 获取推荐内容
 */
export function getRecommendations(params) {
  return request({
    url: '/content/recommendations',
    method: 'get',
    params
  })
}

/**
 * 点赞内容
 */
export function likeContent(data) {
  return request({
    url: '/content/like',
    method: 'post',
    data
  })
}

/**
 * 收藏内容
 */
export function collectContent(data) {
  return request({
    url: '/content/collect',
    method: 'post',
    data
  })
}

/**
 * 发表评论
 */
export function addComment(data) {
  return request({
    url: '/content/comment',
    method: 'post',
    data
  })
}

/**
 * 获取评论列表
 */
export function getComments(params) {
  return request({
    url: '/content/comments',
    method: 'get',
    params
  })
}

