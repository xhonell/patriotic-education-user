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
