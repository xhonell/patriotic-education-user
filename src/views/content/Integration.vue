<template>
  <div class="integration-page">
    <h1 class="page-title">积分积累</h1>

    <!-- 积分总览 -->
    <el-row :gutter="20" class="points-overview">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="point-card gradient-bg-red">
          <div class="point-info">
            <el-icon :size="50">
              <TrophyBase />
            </el-icon>
            <div class="point-text">
              <div class="point-value">{{ userPoints.total }}</div>
              <div class="point-label">总积分</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="point-card gradient-bg-blue">
          <div class="point-info">
            <el-icon :size="50">
              <Medal />
            </el-icon>
            <div class="point-text">
              <div class="point-value">Lv.{{ userPoints.level }}</div>
              <div class="point-label">{{ currentLevelName }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card
          class="point-card"
          style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        >
          <div class="point-info">
            <el-icon :size="50">
              <Star />
            </el-icon>
            <div class="point-text">
              <div class="point-value">{{ userPoints.weekPoints }}</div>
              <div class="point-label">本周获得</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card
          class="point-card"
          style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        >
          <div class="point-info">
            <el-icon :size="50">
              <Rank />
            </el-icon>
            <div class="point-text">
              <div class="point-value">{{ userPoints.rank }}</div>
              <div class="point-label">排名</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 每日积分来源 -->
      <el-col :xs="24" :lg="14">
        <el-card class="task-card">
          <template #header>
            <div class="card-header">
              <span>每日积分来源</span>
              <el-tag type="success">今日累计 {{ sourceTotalPoints }} 积分</el-tag>
            </div>
          </template>
          <div class="task-list">
            <div class="task-item" v-for="source in dailySources" :key="source.key">
              <div class="task-icon">
                <el-icon :size="32" :color="source.color">
                  <component :is="source.icon" />
                </el-icon>
              </div>
              <div class="task-content">
                <div class="task-title">{{ source.title }}</div>
                <div class="task-desc">{{ source.description }}</div>
                <div class="task-progress">
                  <el-progress
                    :percentage="source.percentage"
                    :status="source.percentage > 0 ? 'success' : ''"
                  />
                  <span class="progress-text">{{ source.points }} 积分</span>
                </div>
              </div>
              <div class="task-reward">
                <div class="reward-points">+{{ source.points }}</div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 积分规则 -->
        <el-card class="rules-card">
          <template #header>
            <div class="card-header">
              <span>积分规则</span>
            </div>
          </template>
          <el-table :data="pointRules" :show-header="false">
            <el-table-column prop="action" label="行为" />
            <el-table-column prop="points" label="积分" width="120" align="right">
              <template #default="{ row }">
                <span style="color: #67C23A; font-weight: bold">+{{ row.points }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="limit" label="限制" width="150" align="right">
              <template #default="{ row }">
                <el-tag size="small" type="info">{{ row.limit }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 侧边栏 -->
      <el-col :xs="24" :lg="10">
        <!-- 等级进度 -->
        <el-card class="level-card">
          <template #header>
            <div class="card-header">
              <span>等级进度</span>
            </div>
          </template>
          <div class="level-content">
            <div class="current-level">
              <el-icon :size="60" color="#409EFF">
                <Medal />
              </el-icon>
              <h2>Lv.{{ userPoints.level }}</h2>
            </div>
            <el-progress :percentage="levelProgress" :stroke-width="20" :text-inside="true" />
            <p class="level-tip">
              还需
              <span class="highlight">{{ pointsToNextLevel }}</span>
              积分升级到 Lv.{{ userPoints.level + 1 }}
            </p>
          </div>
        </el-card>

        <!-- 积分排行榜 -->
        <el-card class="ranking-card">
          <template #header>
            <div class="card-header">
              <span>积分排行榜</span>
              <el-link type="primary" @click="goToRanking">查看更多</el-link>
            </div>
          </template>
          <div class="ranking-list">
            <div class="ranking-item" v-for="(user, index) in topUsers" :key="user.userId || index">
              <div class="rank-number" :class="'rank-' + (user.ranking || index + 1)">{{ user.ranking || index + 1 }}</div>
              <el-avatar :src="user.avatar" :size="36">
                <el-icon>
                  <User />
                </el-icon>
              </el-avatar>
              <div class="user-info">
                <div class="user-name">{{ user.userName }}</div>
                <div class="user-points">{{ user.points }} 积分</div>
              </div>
            </div>
          </div>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPointsStatistics, getPointsBySource, getPointsRanking } from '@/api/points'

export default {
  name: 'Integration',
  setup() {
    const router = useRouter()

    const userPoints = reactive({
      total: 0,
      level: 1,
      weekPoints: 0,
      rank: '--'
    })

    const dailySources = ref([])
    const sourceTotalPoints = ref(0)

    const pointRules = reactive([
      { action: '其他来源（含签到）', points: 0, limit: '不限制' },
      { action: '文章学习', points: 0, limit: '不限制' },
      { action: '视频学习', points: 0, limit: '不限制' },
      { action: '发表评论', points: 0, limit: '每日最多5积分' },
      { action: '点赞内容', points: 0, limit: '每日最多5积分' },
      { action: '收藏内容', points: 0, limit: '每日最多5积分' }
    ])

    const topUsers = ref([])

    const levelConfigs = [
      { level: 1, name: '新手', points: 0 },
      { level: 2, name: '入门', points: 100 },
      { level: 3, name: '进阶', points: 300 },
      { level: 4, name: '熟练', points: 600 },
      { level: 5, name: '精通', points: 1000 },
      { level: 6, name: '专家', points: 1500 },
      { level: 7, name: '大师', points: 2000 },
      { level: 8, name: '宗师', points: 3000 },
      { level: 9, name: '传说', points: 4000 },
      { level: 10, name: '神话', points: 5000 }
    ]

    const levelThresholds = levelConfigs.map(item => item.points)

    const calcLevelByPoints = (points = 0) => {
      const value = Number(points || 0)
      let level = 1
      for (let i = 0; i < levelThresholds.length; i++) {
        if (value >= levelThresholds[i]) {
          level = i + 1
        }
      }
      return level
    }

    const getLevelName = (level) => {
      return levelConfigs.find(item => item.level === level)?.name || '新手'
    }

    const currentLevelName = computed(() => getLevelName(userPoints.level))

    const levelProgress = computed(() => {
      const currentLevel = calcLevelByPoints(userPoints.total)
      const currentStart = levelThresholds[currentLevel - 1] ?? 0
      const nextStart = levelThresholds[currentLevel] ?? (currentStart + 1000)
      const span = Math.max(1, nextStart - currentStart)
      const progressed = Math.max(0, userPoints.total - currentStart)
      return Math.min(100, Math.floor((progressed / span) * 100))
    })

    const pointsToNextLevel = computed(() => {
      const currentLevel = calcLevelByPoints(userPoints.total)
      const nextStart = levelThresholds[currentLevel]
      if (nextStart == null) return 0
      return Math.max(0, nextStart - userPoints.total)
    })

    const goToRanking = () => {
      router.push('/ranking')
    }

    const loadPointsStatistics = async () => {
      try {
        const res = await getPointsStatistics()
        if (res.code === 200 && res.data) {
          userPoints.total = Number(res.data.totalPoints || 0)
          userPoints.weekPoints = Number(res.data.thisWeekPoints || 0)
          userPoints.rank = res.data.ranking ?? '--'
          userPoints.level = calcLevelByPoints(userPoints.total)
        }
      } catch (error) {
        console.error('获取积分统计失败：', error)
      }
    }

    const loadPointsRanking = async () => {
      try {
        const res = await getPointsRanking()
        if (res.code === 200 && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.list || res.data.records || [])
          topUsers.value = list.slice(0, 5).map(item => ({
            ranking: item.ranking,
            userId: item.userId,
            userName: item.userName || '匿名用户',
            avatar: item.avatarUrl || 'https://via.placeholder.com/100',
            points: Number(item.points || 0)
          }))
        }
      } catch (error) {
        console.error('获取积分排行榜失败：', error)
      }
    }

    const loadPointsBySource = async () => {
      try {
        const res = await getPointsBySource()
        if (res.code === 200 && res.data) {
          const bySource = res.data
          const articlePoints = Number(bySource.articlePoints || 0)
          const videoPoints = Number(bySource.videoPoints || 0)
          const commentPoints = Number(bySource.commentPoints || 0)
          const likePoints = Number(bySource.likePoints || 0)
          const collectPoints = Number(bySource.collectPoints || 0)
          const otherPoints = Number(bySource.otherPoints || 0)
          const totalPoints = Number(
            bySource.totalPoints ||
              (articlePoints + videoPoints + commentPoints + likePoints + collectPoints + otherPoints)
          )

          sourceTotalPoints.value = totalPoints
          dailySources.value = [
            {
              key: 'article',
              title: '文章学习',
              description: '完成文章学习获得积分',
              icon: 'Reading',
              color: '#409EFF',
              points: articlePoints,
              percentage: totalPoints > 0 ? Math.round((articlePoints / totalPoints) * 100) : 0
            },
            {
              key: 'video',
              title: '视频学习',
              description: '完成视频学习获得积分',
              icon: 'VideoCamera',
              color: '#67C23A',
              points: videoPoints,
              percentage: totalPoints > 0 ? Math.round((videoPoints / totalPoints) * 100) : 0
            },
            {
              key: 'comment',
              title: '发表评论',
              description: '参与评论互动获得积分',
              icon: 'ChatDotRound',
              color: '#E6A23C',
              points: commentPoints,
              percentage: totalPoints > 0 ? Math.round((commentPoints / totalPoints) * 100) : 0
            },
            {
              key: 'like',
              title: '点赞内容',
              description: '点赞优质内容获得积分',
              icon: 'Star',
              color: '#F56C6C',
              points: likePoints,
              percentage: totalPoints > 0 ? Math.round((likePoints / totalPoints) * 100) : 0
            },
            {
              key: 'collect',
              title: '收藏内容',
              description: '收藏学习内容获得积分',
              icon: 'Collection',
              color: '#909399',
              points: collectPoints,
              percentage: totalPoints > 0 ? Math.round((collectPoints / totalPoints) * 100) : 0
            },
            {
              key: 'other',
              title: '其他来源',
              description: '签到等其他行为获得积分',
              icon: 'Calendar',
              color: '#8E44AD',
              points: otherPoints,
              percentage: totalPoints > 0 ? Math.round((otherPoints / totalPoints) * 100) : 0
            }
          ]

          pointRules[0].points = otherPoints
          pointRules[1].points = articlePoints
          pointRules[2].points = videoPoints
          pointRules[3].points = commentPoints
          pointRules[4].points = likePoints
          pointRules[5].points = collectPoints
        }
      } catch (error) {
        console.error('获取积分来源统计失败：', error)
      }
    }

    onMounted(() => {
      loadPointsStatistics()
      loadPointsBySource()
      loadPointsRanking()
    })

    return {
      userPoints,
      dailySources,
      sourceTotalPoints,
      pointRules,
      topUsers,
      levelProgress,
      pointsToNextLevel,
      currentLevelName,
      goToRanking
    }
  }
}
</script>

<style scoped>
.integration-page {
  max-width: 1400px;
  margin: 0 auto;
}

.points-overview {
  margin-bottom: 24px;
}

.point-card {
  margin-bottom: 20px;
  color: white;
  border: none;
}

.point-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.point-text {
  flex: 1;
}

.point-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 4px;
}

.point-label {
  font-size: 14px;
  opacity: 0.9;
}

.task-card {
  margin-bottom: 24px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
  transition: all 0.3s;
}

.task-item:hover {
  background: #e8eaf0;
  transform: translateX(4px);
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
}

.task-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  font-size: 13px;
  color: #999;
  white-space: nowrap;
}

.task-reward {
  text-align: center;
}

.reward-points {
  font-size: 20px;
  font-weight: bold;
  color: #67c23a;
  margin-bottom: 8px;
}

.rules-card {
  margin-bottom: 24px;
}

.level-card {
  margin-bottom: 24px;
}

.level-content {
  text-align: center;
}

.current-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.current-level h2 {
  font-size: 32px;
  color: #409eff;
  margin: 0;
}

.level-tip {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}

.highlight {
  color: #409eff;
  font-weight: bold;
  font-size: 18px;
}

.ranking-card {
  margin-bottom: 24px;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s;
}

.ranking-item:hover {
  background: #f5f7fa;
}

.rank-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 16px;
  background: #e8eaf0;
  color: #666;
}

.rank-1 {
  background: linear-gradient(135deg, #ffd700, #ffa500);
  color: white;
}

.rank-2 {
  background: linear-gradient(135deg, #c0c0c0, #808080);
  color: white;
}

.rank-3 {
  background: linear-gradient(135deg, #cd7f32, #8b4513);
  color: white;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.user-points {
  font-size: 12px;
  color: #999;
}
</style>

