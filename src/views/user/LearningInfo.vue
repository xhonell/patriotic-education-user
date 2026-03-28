<template>
  <div class="learning-info-page">
    <h1 class="page-title">学习信息查看</h1>

    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6" v-for="item in statsCards" :key="item.title">
        <el-card class="stat-card" :body-style="{ padding: '24px' }">
          <div class="stat-content">
            <el-icon :size="40" :color="item.color">
              <component :is="item.icon" />
            </el-icon>
            <div class="stat-text">
              <div class="stat-value">{{ item.value }}{{ item.unit }}</div>
              <div class="stat-label">{{ item.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-tabs v-model="activeTab" class="learning-tabs">
      <el-tab-pane label="学习历史" name="history">
        <el-table :data="learningHistory" style="width: 100%">
          <el-table-column prop="title" label="标题" min-width="200" />
          <el-table-column prop="type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="row.type === '文章' ? 'success' : 'warning'">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="points" label="获得积分" width="120" />
          <el-table-column prop="date" label="学习日期" width="180" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="continueLearn(row)">继续学习</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="table-pagination"
          :current-page="learningPage"
          :page-size="learningPageSize"
          :total="learningTotal"
          layout="total, prev, pager, next"
          @current-change="handleLearningPageChange"
        />
      </el-tab-pane>

      <el-tab-pane label="积分明细" name="points">
        <el-timeline>
          <el-timeline-item
            v-for="item in pointsHistory"
            :key="item.id"
            :timestamp="item.date"
            placement="top"
          >
            <el-card>
              <h4>{{ item.title }}</h4>
              <p style="margin: 8px 0;">
                <span :style="{ color: item.points > 0 ? '#67C23A' : '#F56C6C', fontWeight: 'bold' }">
                  {{ item.points > 0 ? '+' : '' }}{{ item.points }} 积分
                </span>
              </p>
              <p style="color: #999; font-size: 13px;">{{ item.description }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <el-pagination
          class="table-pagination"
          :current-page="pointsPage"
          :page-size="pointsPageSize"
          :total="pointsTotal"
          layout="total, prev, pager, next"
          @current-change="handlePointsPageChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPointsHistory, getLearningHistory, getUserStatistics } from '@/api/user'

export default {
  name: 'LearningInfo',
  setup() {
    const router = useRouter()
    const activeTab = ref('history')

    const statsCards = reactive([
      { title: '学习文章', value: 0, unit: '篇', icon: 'Reading', color: '#67C23A' },
      { title: '学习视频', value: 0, unit: '个', icon: 'VideoCamera', color: '#E6A23C' },
      { title: '发表帖子', value: 0, unit: '条', icon: 'ChatDotRound', color: '#409EFF' },
      { title: '获得积分', value: 0, unit: '分', icon: 'TrophyBase', color: '#F56C6C' }
    ])

    const learningHistory = ref([])
    const learningPage = ref(1)
    const learningPageSize = ref(10)
    const learningTotal = ref(0)

    const pointsHistory = ref([])
    const pointsPage = ref(1)
    const pointsPageSize = ref(10)
    const pointsTotal = ref(0)

    const progressColor = (percentage) => {
      if (percentage < 30) return '#F56C6C'
      if (percentage < 70) return '#E6A23C'
      return '#67C23A'
    }


    const loadLearningHistory = async () => {
      try {
        const res = await getLearningHistory({
          page: learningPage.value,
          pageSize: learningPageSize.value
        })
        if (res.code === 200 && res.data) {
          const pageData = res.data
          const list = pageData.list || pageData.records || []
          learningTotal.value = Number(pageData.total || list.length || 0)
          learningHistory.value = list.map(item => ({
            id: item.id,
            title: item.remark || '学习记录',
            type: Number(item.sourceType) === 1 ? '文章' : '视频',
            points: Number(item.points || 0),
            date: item.createTime || '',
            sourceId: item.sourceId
          }))
        }
      } catch (error) {
        console.error('获取学习历史失败：', error)
      }
    }

    const loadUserStatistics = async () => {
      try {
        const res = await getUserStatistics()
        if (res.code === 200 && res.data) {
          statsCards[0].value = Number(res.data.articleCount || 0)
          statsCards[1].value = Number(res.data.videoCount || 0)
          statsCards[2].value = Number(res.data.topicCount || 0)
          statsCards[3].value = Number(res.data.points || 0)
        }
      } catch (error) {
        console.error('获取学习统计失败：', error)
      }
    }

    const loadPointsHistory = async () => {
      try {
        const res = await getPointsHistory({
          page: pointsPage.value,
          pageSize: pointsPageSize.value
        })
        if (res.code === 200 && res.data) {
          const pageData = res.data
          const list = pageData.list || pageData.records || []
          pointsTotal.value = Number(pageData.total || list.length || 0)
          pointsHistory.value = list.map(item => ({
            id: item.id,
            title: item.sourceTypeName || item.remark || '积分变动',
            points: Number(item.changePoints || 0),
            description: item.remark || `来源类型：${item.sourceTypeName || item.sourceType || '--'}`,
            date: item.createTime || ''
          }))
        }
      } catch (error) {
        console.error('获取积分明细失败：', error)
      }
    }

    const handleLearningPageChange = (page) => {
      learningPage.value = page
      loadLearningHistory()
    }

    const handlePointsPageChange = (page) => {
      pointsPage.value = page
      loadPointsHistory()
    }

    const continueLearn = (row) => {
      const targetId = row.sourceId || row.id
      if (!targetId) return
      if (row.type === '文章') {
        router.push(`/article-detail/${targetId}`)
      } else {
        router.push(`/video-detail/${targetId}`)
      }
    }

    onMounted(() => {
      loadUserStatistics()
      loadLearningHistory()
      loadPointsHistory()
    })

    return {
      activeTab,
      statsCards,
      learningHistory,
      pointsHistory,
      learningPage,
      learningPageSize,
      learningTotal,
      pointsPage,
      pointsPageSize,
      pointsTotal,
      progressColor,
      continueLearn,
      handleLearningPageChange,
      handlePointsPageChange
    }
  }
}
</script>

<style scoped>
.learning-info-page {
  max-width: 1400px;
  margin: 0 auto;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-text {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.learning-tabs {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.table-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .stats-row {
    margin-bottom: 16px;
  }

  .stat-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>

