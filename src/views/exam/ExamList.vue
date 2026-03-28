<template>
  <div class="exam-list-page">
    <h1 class="page-title">在线考试</h1>

    <el-card>
      <el-table :data="papers" v-loading="loading" style="width: 100%">
        <el-table-column prop="title" label="试卷名称" min-width="220" />
        <el-table-column prop="totalScore" label="总分" width="90" />
        <el-table-column prop="passScore" label="及格分" width="90" />
        <el-table-column prop="questionCount" label="题目数" width="90" />
        <el-table-column prop="duration" label="时长(分钟)" width="110" />
        <el-table-column label="答题状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.isAnswered ? 'success' : 'info'">
              {{ row.isAnswered ? '已答题' : '未答题' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleAction(row)">
              {{ row.isAnswered ? '查看记录' : '开始答题' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pager"
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="onPageChange"
      />
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getExamList } from '@/api/exam'

export default {
  name: 'ExamList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const papers = ref([])
    const page = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    const loadData = async () => {
      loading.value = true
      try {
        const res = await getExamList({ page: page.value, pageSize: pageSize.value })
        if (res.code === 200 && res.data) {
          const list = res.data.list || res.data.records || []
          total.value = Number(res.data.total || list.length || 0)
          papers.value = list
        }
      } finally {
        loading.value = false
      }
    }

    const onPageChange = (p) => {
      page.value = p
      loadData()
    }

    const goExam = (id) => {
      router.push(`/exam/paper/${id}`)
    }

    const handleAction = (row) => {
      if (row.isAnswered) {
        router.push('/exam/records')
      } else {
        goExam(row.id)
      }
    }

    onMounted(loadData)

    return { loading, papers, page, pageSize, total, onPageChange, goExam, handleAction }
  }
}
</script>

<style scoped>
.pager { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>

