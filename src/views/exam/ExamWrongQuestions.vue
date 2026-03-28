<template>
  <div class="exam-wrong-page">
    <h1 class="page-title">错题本</h1>

    <el-card v-loading="loading">
      <div v-for="(item, idx) in list" :key="item.questionId || idx" class="wrong-item">
        <div class="title">{{ idx + 1 }}. {{ item.content }}</div>
        <div class="line">题型：{{ item.typeName || item.type }}</div>
        <div class="line">正确答案：{{ item.correctAnswer || '-' }}</div>
        <div class="line">错误次数：{{ item.wrongCount ?? 0 }}</div>
        <div class="line">最后错误时间：{{ item.lastWrongTime || '-' }}</div>
        <div class="line">解析：{{ item.analysis || '暂无解析' }}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getWrongQuestions } from '@/api/exam'

export default {
  name: 'ExamWrongQuestions',
  setup() {
    const loading = ref(false)
    const list = ref([])

    const loadData = async () => {
      loading.value = true
      try {
        const res = await getWrongQuestions()
        if (res.code === 200 && Array.isArray(res.data)) {
          list.value = res.data
        }
      } finally {
        loading.value = false
      }
    }

    onMounted(loadData)
    return { loading, list }
  }
}
</script>

<style scoped>
.wrong-item { padding: 12px 0; border-bottom: 1px solid #eee; }
.title { font-weight: 600; margin-bottom: 8px; }
.line { color: #555; margin: 4px 0; }
</style>

