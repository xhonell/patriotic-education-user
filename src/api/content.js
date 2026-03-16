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
 * 视频分页查询
 */
export function getVideoPage(data) {
  return request({
    url: '/server/video/page',
    method: 'post',
    data
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
 * 获取视频详情（新接口）
 */
export function getVideoDetailById(id) {
  return request({
    url: `/server/video/detail/${id}`,
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

/**
 * 获取首页轮播图
 */
export function getBannerList() {
  return request({
    url: '/server/common/banner',
    method: 'get'
  })
}

/**
 * 获取推荐内容列表
 */
export function getRecommendList() {
  return request({
    url: '/server/recommend/list',
    method: 'post'
  })
}

/**
 * 获取推荐视频列表
 */
export function getRecommendVideos() {
  return request({
    url: '/server/recommend/videos',
    method: 'post'
  })
}

/**
 * 获取近一周热门文章列表
 */
export function getWeeklyHotArticles() {
  return request({
    url: '/server/recommend/weekly-hot-articles',
    method: 'get'
  })
}

/**
 * 获取统计信息
 */
export function getStatistics() {
  return request({
    url: '/server/statistics/info',
    method: 'get'
  })
}

