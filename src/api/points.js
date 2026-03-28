import request from './request'

/**
 * 增加积分
 * @param {{sourceType: string, sourceId?: string, remark?: string, points?: number}} data
 */
export function addPoints(data) {
  return request({
    url: '/server/points/add',
    method: 'post',
    data
  })
}

/**
 * 获取积分统计信息
 */
export function getPointsStatistics() {
  return request({
    url: '/server/common/points/statistics',
    method: 'get'
  })
}

/**
 * 获取按来源统计的积分数量
 */
export function getPointsBySource() {
  return request({
    url: '/server/common/points/by-source',
    method: 'get'
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