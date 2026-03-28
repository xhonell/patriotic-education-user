<template>
  <div class="exam-paper-page">
    <h1 class="page-title">试卷答题</h1>
    <el-card v-loading="loading">
      <template v-if="paper">
        <h2>{{ paper.title }}</h2>
        <p class="meta">总分：{{ paper.totalScore }}，及格：{{ paper.passScore }}</p>

        <div v-for="(q, idx) in questions" :key="q.id" class="question-item">
          <div class="q-title">{{ idx + 1 }}. {{ q.content }}</div>

          <el-radio-group v-if="Number(q.type) === 1 || Number(q.type) === 3" v-model="answers[q.id]">
            <el-radio
              v-for="(op, opIdx) in q.options || []"
              :key="op.value || op.key || op.option || opIdx"
              :label="op.value || op.key || op.option || String(opIdx)"
            >
              {{ op.label || op.content || op.optionText || op.text || op.value || op.key || op.option }}
            </el-radio>
          </el-radio-group>

          <el-checkbox-group v-else-if="Number(q.type) === 2" v-model="answers[q.id]">
            <el-checkbox
              v-for="(op, opIdx) in q.options || []"
              :key="op.value || op.key || op.option || opIdx"
              :label="op.value || op.key || op.option || String(opIdx)"
            >
              {{ op.label || op.content || op.optionText || op.text || op.value || op.key || op.option }}
            </el-checkbox>
          </el-checkbox-group>

          <el-input v-else v-model="answers[q.id]" type="textarea" :rows="2" placeholder="请输入答案" />
        </div>

        <el-button type="primary" :loading="submitting" @click="handleSubmit">提交答卷</el-button>
      </template>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getExamPaperDetail, submitExam } from '@/api/exam'

export default {
  name: 'ExamPaper',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const submitting = ref(false)
    const paper = ref(null)
    const answers = reactive({})

    const questions = computed(() => {
      const p = paper.value || {}
      return p.questions || p.questionList || []
    })

    const loadData = async () => {
      loading.value = true
      try {
        const res = await getExamPaperDetail(route.params.paperId)
        if (res.code === 200 && res.data) {
          paper.value = res.data
        }
      } finally {
        loading.value = false
      }
    }

    const normalizeAnswer = (val) => {
      if (Array.isArray(val)) return val.join(',')
      return val == null ? '' : String(val)
    }

    const handleSubmit = async () => {
      const payload = {
        paperId: Number(route.params.paperId),
        answers: questions.value.map(q => ({
          questionId: q.id,
          answer: normalizeAnswer(answers[q.id])
        }))
      }
      submitting.value = true
      try {
        const res = await submitExam(payload)
        if (res.code === 200) {
          ElMessage.success('提交成功')
          const recordId = res.data
          router.push(recordId ? `/exam/record/${recordId}` : '/exam/records')
        }
      } finally {
        submitting.value = false
      }
    }

    onMounted(loadData)
    return { loading, submitting, paper, questions, answers, handleSubmit }
  }
}
</script>

<style scoped>
.question-item { margin: 16px 0; padding: 12px; background: #f7f7f7; border-radius: 8px; }
.q-title { margin-bottom: 8px; font-weight: 600; }
.meta { color: #666; margin-bottom: 12px; }
</style>
