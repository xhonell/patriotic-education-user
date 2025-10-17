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
              <div class="stat-value">{{ item.value }}</div>
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
          <el-table-column prop="duration" label="学习时长" width="120" />
          <el-table-column prop="progress" label="学习进度" width="150">
            <template #default="{ row }">
              <el-progress :percentage="row.progress" :color="progressColor" />
            </template>
          </el-table-column>
          <el-table-column prop="date" label="学习日期" width="180" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="continueLearn(row)">继续学习</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      </el-tab-pane>

      <el-tab-pane label="学习统计" name="statistics">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>每周学习时长</span>
                </div>
              </template>
              <div class="chart-container">
                <div class="chart-placeholder">图表区域（可接入ECharts）</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>学习类型分布</span>
                </div>
              </template>
              <div class="chart-container">
                <div class="chart-placeholder">图表区域（可接入ECharts）</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LearningInfo',
  setup() {
    const router = useRouter()
    const activeTab = ref('history')

    const statsCards = reactive([
      { title: '学习天数', value: '128天', icon: 'Calendar', color: '#409EFF' },
      { title: '学习时长', value: '256小时', icon: 'Timer', color: '#67C23A' },
      { title: '完成课程', value: '45个', icon: 'Document', color: '#E6A23C' },
      { title: '获得积分', value: '1250分', icon: 'TrophyBase', color: '#F56C6C' }
    ])

    const learningHistory = reactive([
      {
        id: 1,
        title: '新中国成立的伟大历程',
        type: '文章',
        duration: '25分钟',
        progress: 100,
        date: '2025-10-17 14:30'
      },
      {
        id: 2,
        title: '改革开放四十年',
        type: '视频',
        duration: '42分钟',
        progress: 75,
        date: '2025-10-16 10:20'
      },
      {
        id: 3,
        title: '科技强国之路',
        type: '文章',
        duration: '18分钟',
        progress: 100,
        date: '2025-10-15 16:45'
      }
    ])

    const pointsHistory = reactive([
      {
        id: 1,
        title: '完成文章学习',
        points: 20,
        description: '学习《新中国成立的伟大历程》',
        date: '2025-10-17 14:30'
      },
      {
        id: 2,
        title: '每日签到',
        points: 5,
        description: '连续签到第7天',
        date: '2025-10-17 08:00'
      },
      {
        id: 3,
        title: '视频学习',
        points: 15,
        description: '观看《改革开放四十年》',
        date: '2025-10-16 10:20'
      },
      {
        id: 4,
        title: '发表评论',
        points: 10,
        description: '在论坛发表优质评论',
        date: '2025-10-15 20:15'
      }
    ])

    const progressColor = (percentage) => {
      if (percentage < 30) return '#F56C6C'
      if (percentage < 70) return '#E6A23C'
      return '#67C23A'
    }

    const continueLearn = (row) => {
      if (row.type === '文章') {
        router.push(`/article-detail/${row.id}`)
      } else {
        router.push(`/video-detail/${row.id}`)
      }
    }

    return {
      activeTab,
      statsCards,
      learningHistory,
      pointsHistory,
      progressColor,
      continueLearn
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

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  color: #999;
  font-size: 16px;
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

