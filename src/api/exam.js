import request from './request'

/**
 * 分页查询已发布试卷
 */
export function getExamList(params) {
  return request({
    url: '/server/exam/list',
    method: 'get',
    params
  })
}

/**
 * 获取试卷详情（不含答案）
 */
export function getExamPaperDetail(paperId) {
  return request({
    url: `/server/exam/paper/${paperId}`,
    method: 'get'
  })
}

/**
 * 提交答卷
 */
export function submitExam(data) {
  return request({
    url: '/server/exam/submit',
    method: 'post',
    data
  })
}

/**
 * 分页查询我的考试记录
 */
export function getMyExamRecords(params) {
  return request({
    url: '/server/exam/my/records',
    method: 'get',
    params
  })
}

/**
 * 获取答卷详情（含答案）
 */
export function getExamRecordDetail(recordId) {
  return request({
    url: `/server/exam/record/${recordId}`,
    method: 'get'
  })
}

/**
 * 获取错题本
 */
export function getWrongQuestions() {
  return request({
    url: '/server/exam/wrong/questions',
    method: 'get'
  })
}
