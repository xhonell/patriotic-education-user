<template>
  <div class="exam-records-page">
    <h1 class="page-title">我的考试记录</h1>

    <el-card>
      <el-table :data="records" v-loading="loading" style="width: 100%">
        <el-table-column prop="paperTitle" label="试卷" min-width="220" />
        <el-table-column prop="score" label="得分" width="90" />
        <el-table-column prop="correctCount" label="正确题数" width="100" />
        <el-table-column prop="answerCount" label="答题数" width="90" />
        <el-table-column label="是否及格" width="100">
          <template #default="{ row }">
            <el-tag :type="Number(row.passStatus) === 1 ? 'success' : 'danger'">
              {{ Number(row.passStatus) === 1 ? '及格' : '不及格' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="goDetail(row.id)">查看详情</el-button>
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
import { getMyExamRecords } from '@/api/exam'

export default {
  name: 'ExamRecords',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const records = ref([])
    const page = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    const loadData = async () => {
      loading.value = true
      try {
        const res = await getMyExamRecords({ page: page.value, pageSize: pageSize.value })
        if (res.code === 200 && res.data) {
          const list = res.data.list || res.data.records || []
          total.value = Number(res.data.total || list.length || 0)
          records.value = list
        }
      } finally {
        loading.value = false
      }
    }

    const onPageChange = (p) => {
      page.value = p
      loadData()
    }

    const goDetail = (id) => router.push(`/exam/record/${id}`)

    onMounted(loadData)

    return { loading, records, page, pageSize, total, onPageChange, goDetail }
  }
}
</script>

<style scoped>
.pager { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
