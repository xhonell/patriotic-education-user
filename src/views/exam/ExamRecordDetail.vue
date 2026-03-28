<template>
  <div class="exam-record-detail-page">
    <h1 class="page-title">答卷详情</h1>
    <el-card v-loading="loading">
      <div v-for="(item, idx) in details" :key="item.id || idx" class="detail-item">
        <div class="title">{{ idx + 1 }}. {{ item.content }}</div>
        <div class="line">你的答案：{{ item.userAnswer || '-' }}</div>
        <div class="line">正确答案：{{ item.correctAnswer || '-' }}</div>
        <div class="line">得分：{{ item.score ?? 0 }}</div>
        <div class="line">结果：
          <el-tag :type="item.isCorrect ? 'success' : 'danger'">{{ item.isCorrect ? '正确' : '错误' }}</el-tag>
        </div>
        <div class="line">解析：{{ item.analysis || '暂无解析' }}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getExamRecordDetail } from '@/api/exam'

export default {
  name: 'ExamRecordDetail',
  setup() {
    const route = useRoute()
    const loading = ref(false)
    const details = ref([])

    const loadData = async () => {
      loading.value = true
      try {
        const res = await getExamRecordDetail(route.params.recordId)
        if (res.code === 200 && Array.isArray(res.data)) {
          details.value = res.data
        }
      } finally {
        loading.value = false
      }
    }

    onMounted(loadData)
    return { loading, details }
  }
}
</script>

<style scoped>
.detail-item { padding: 12px 0; border-bottom: 1px solid #eee; }
.title { font-weight: 600; margin-bottom: 8px; }
.line { color: #555; margin: 4px 0; }
</style>
