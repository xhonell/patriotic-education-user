<template>
  <div class="integration-page">
    <h1 class="page-title">积分积累</h1>

    <!-- 积分总览 -->
    <el-row :gutter="20" class="points-overview">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="point-card gradient-bg-red">
          <div class="point-info">
            <el-icon :size="50"><TrophyBase /></el-icon>
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
            <el-icon :size="50"><Medal /></el-icon>
            <div class="point-text">
              <div class="point-value">Lv.{{ userPoints.level }}</div>
              <div class="point-label">当前等级</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="point-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
          <div class="point-info">
            <el-icon :size="50"><Star /></el-icon>
            <div class="point-text">
              <div class="point-value">{{ userPoints.weekPoints }}</div>
              <div class="point-label">本周获得</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="point-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <div class="point-info">
            <el-icon :size="50"><Rank /></el-icon>
            <div class="point-text">
              <div class="point-value">{{ userPoints.rank }}</div>
              <div class="point-label">排名</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 积分任务 -->
      <el-col :xs="24" :lg="14">
        <el-card class="task-card">
          <template #header>
            <div class="card-header">
              <span>每日任务</span>
              <el-tag type="success">今日已完成 {{ completedTasks }}/{{ dailyTasks.length }}</el-tag>
            </div>
          </template>
          <div class="task-list">
            <div class="task-item" v-for="task in dailyTasks" :key="task.id">
              <div class="task-icon">
                <el-icon :size="32" :color="task.completed ? '#67C23A' : '#409EFF'">
                  <component :is="task.icon" />
                </el-icon>
              </div>
              <div class="task-content">
                <div class="task-title">{{ task.title }}</div>
                <div class="task-desc">{{ task.description }}</div>
                <div class="task-progress">
                  <el-progress :percentage="task.progress" :status="task.completed ? 'success' : ''" />
                  <span class="progress-text">{{ task.current }}/{{ task.target }}</span>
                </div>
              </div>
              <div class="task-reward">
                <div class="reward-points">+{{ task.points }}</div>
                <el-button
                  v-if="task.completed && !task.claimed"
                  type="success"
                  size="small"
                  @click="claimReward(task)"
                >
                  领取
                </el-button>
                <el-tag v-else-if="task.claimed" type="info" size="small">已领取</el-tag>
                <el-button v-else type="primary" size="small" @click="goToTask(task)">
                  去完成
                </el-button>
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
              <el-icon :size="60" color="#409EFF"><Medal /></el-icon>
              <h2>Lv.{{ userPoints.level }}</h2>
            </div>
            <el-progress
              :percentage="levelProgress"
              :stroke-width="20"
              :text-inside="true"
            />
            <p class="level-tip">
              还需 <span class="highlight">{{ pointsToNextLevel }}</span> 积分升级到 Lv.{{ userPoints.level + 1 }}
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
            <div class="ranking-item" v-for="(user, index) in topUsers" :key="user.id">
              <div class="rank-number" :class="'rank-' + (index + 1)">
                {{ index + 1 }}
              </div>
              <el-avatar :src="user.avatar" :size="36">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="user-info">
                <div class="user-name">{{ user.username }}</div>
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'Integration',
  setup() {
    const router = useRouter()

    const userPoints = reactive({
      total: 1250,
      level: 5,
      weekPoints: 180,
      rank: 128
    })

    const dailyTasks = reactive([
      {
        id: 1,
        title: '每日签到',
        description: '连续签到可获得额外奖励',
        icon: 'Calendar',
        points: 5,
        current: 1,
        target: 1,
        progress: 100,
        completed: true,
        claimed: false
      },
      {
        id: 2,
        title: '学习文章',
        description: '完成3篇文章学习',
        icon: 'Reading',
        points: 30,
        current: 2,
        target: 3,
        progress: 67,
        completed: false,
        claimed: false
      },
      {
        id: 3,
        title: '观看视频',
        description: '完成2个视频观看',
        icon: 'VideoCamera',
        points: 40,
        current: 1,
        target: 2,
        progress: 50,
        completed: false,
        claimed: false
      },
      {
        id: 4,
        title: '社区互动',
        description: '发表5条评论',
        icon: 'ChatDotRound',
        points: 20,
        current: 3,
        target: 5,
        progress: 60,
        completed: false,
        claimed: false
      }
    ])

    const pointRules = reactive([
      { action: '每日签到', points: 5, limit: '每天1次' },
      { action: '完成文章学习', points: 20, limit: '不限次数' },
      { action: '完成视频学习', points: 30, limit: '不限次数' },
      { action: '发表评论', points: 10, limit: '每天10次' },
      { action: '发表帖子', points: 15, limit: '每天5次' },
      { action: '评论被点赞', points: 2, limit: '不限次数' },
      { action: '连续签到7天', points: 50, limit: '每周1次' }
    ])

    const topUsers = reactive([
      { id: 1, username: '学习之星', avatar: 'https://via.placeholder.com/100', points: 5280 },
      { id: 2, username: '爱国青年', avatar: 'https://via.placeholder.com/100', points: 4650 },
      { id: 3, username: '奋斗者', avatar: 'https://via.placeholder.com/100', points: 3920 },
      { id: 4, username: '追梦人', avatar: 'https://via.placeholder.com/100', points: 3540 },
      { id: 5, username: '知识达人', avatar: 'https://via.placeholder.com/100', points: 3280 }
    ])

    const completedTasks = computed(() => {
      return dailyTasks.filter(task => task.completed).length
    })

    const levelProgress = computed(() => {
      const basePoints = (userPoints.level - 1) * 500
      const currentLevelPoints = userPoints.total - basePoints
      const nextLevelRequire = 500
      return Math.floor((currentLevelPoints / nextLevelRequire) * 100)
    })

    const pointsToNextLevel = computed(() => {
      const basePoints = (userPoints.level - 1) * 500
      const currentLevelPoints = userPoints.total - basePoints
      const nextLevelRequire = 500
      return nextLevelRequire - currentLevelPoints
    })

    const claimReward = (task) => {
      task.claimed = true
      userPoints.total += task.points
      userPoints.weekPoints += task.points
      ElMessage.success(`领取成功！获得 ${task.points} 积分`)
    }

    const goToTask = (task) => {
      switch (task.id) {
        case 1:
          router.push('/check-in')
          break
        case 2:
          router.push('/article-learning')
          break
        case 3:
          router.push('/video-learning')
          break
        case 4:
          router.push('/community')
          break
      }
    }

    const goToRanking = () => {
      router.push('/ranking')
    }

    return {
      userPoints,
      dailyTasks,
      pointRules,
      topUsers,
      completedTasks,
      levelProgress,
      pointsToNextLevel,
      claimReward,
      goToTask,
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
  color: #67C23A;
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
  color: #409EFF;
  margin: 0;
}

.level-tip {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}

.highlight {
  color: #409EFF;
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
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
}

.rank-2 {
  background: linear-gradient(135deg, #C0C0C0, #808080);
  color: white;
}

.rank-3 {
  background: linear-gradient(135deg, #CD7F32, #8B4513);
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

