<template>
  <div class="ranking-page">
    <h1 class="page-title">社区等级排行榜</h1>

    <!-- 排行榜类型切换 -->
    <el-card class="tabs-card" :body-style="{ padding: '20px' }">
      <el-radio-group v-model="activeTab" size="large" @change="handleTabChange">
        <el-radio-button label="points">积分排行</el-radio-button>
        <el-radio-button label="checkin">签到排行</el-radio-button>
        <el-radio-button label="learning">学习排行</el-radio-button>
        <el-radio-button label="contribution">贡献排行</el-radio-button>
      </el-radio-group>
    </el-card>

    <el-row :gutter="20">
      <!-- 排行榜主体 -->
      <el-col :xs="24" :lg="16">
        <!-- 前三名展示 -->
        <el-card class="top-three-card">
          <div class="top-three">
            <!-- 第二名 -->
            <div class="rank-item rank-2">
              <div class="rank-badge">
                <img src="https://via.placeholder.com/100x100?text=2" alt="第二名" class="badge-img" />
              </div>
              <el-avatar :src="topUsers[1].avatar" :size="80">
                <el-icon><User /></el-icon>
              </el-avatar>
              <h3>{{ topUsers[1].username }}</h3>
              <div class="rank-score">{{ getRankValue(topUsers[1]) }}</div>
            </div>

            <!-- 第一名 -->
            <div class="rank-item rank-1">
              <div class="rank-badge">
                <img src="https://via.placeholder.com/120x120?text=1" alt="第一名" class="badge-img" />
              </div>
              <el-avatar :src="topUsers[0].avatar" :size="100">
                <el-icon><User /></el-icon>
              </el-avatar>
              <h3>{{ topUsers[0].username }}</h3>
              <div class="rank-score">{{ getRankValue(topUsers[0]) }}</div>
            </div>

            <!-- 第三名 -->
            <div class="rank-item rank-3">
              <div class="rank-badge">
                <img src="https://via.placeholder.com/100x100?text=3" alt="第三名" class="badge-img" />
              </div>
              <el-avatar :src="topUsers[2].avatar" :size="80">
                <el-icon><User /></el-icon>
              </el-avatar>
              <h3>{{ topUsers[2].username }}</h3>
              <div class="rank-score">{{ getRankValue(topUsers[2]) }}</div>
            </div>
          </div>
        </el-card>

        <!-- 排行榜列表 -->
        <el-card class="ranking-list-card">
          <div class="ranking-list">
            <div class="ranking-item" v-for="(user, index) in rankedUsers" :key="user.id">
              <div class="rank-number" :class="getRankClass(index + 4)">
                {{ index + 4 }}
              </div>
              <el-avatar :src="user.avatar" :size="48">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="user-info">
                <div class="user-name">{{ user.username }}</div>
                <div class="user-level">Lv.{{ user.level }}</div>
              </div>
              <div class="user-score">
                <span class="score-value">{{ getRankValue(user) }}</span>
                <span class="score-label">{{ getRankLabel() }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 侧边栏 -->
      <el-col :xs="24" :lg="8">
        <!-- 我的排名 -->
        <el-card class="my-rank-card">
          <template #header>
            <div class="card-header">
              <span>我的排名</span>
            </div>
          </template>
          <div class="my-rank-content">
            <el-avatar :size="80" src="https://via.placeholder.com/100">
              <el-icon><User /></el-icon>
            </el-avatar>
            <h3>当前用户</h3>
            <div class="my-rank-number">第 {{ myRank }} 名</div>
            <div class="my-rank-stats">
              <div class="stat-item">
                <div class="stat-value">{{ myStats.points }}</div>
                <div class="stat-label">积分</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">Lv.{{ myStats.level }}</div>
                <div class="stat-label">等级</div>
              </div>
            </div>
            <el-progress
              :percentage="levelProgress"
              :stroke-width="12"
              :text-inside="true"
              class="level-progress"
            />
            <p class="progress-tip">
              再获得 <span class="highlight">{{ pointsToNextRank }}</span> 积分可超越前一名
            </p>
          </div>
        </el-card>

        <!-- 等级说明 -->
        <el-card class="level-info-card">
          <template #header>
            <div class="card-header">
              <span>等级说明</span>
            </div>
          </template>
          <div class="level-list">
            <div class="level-item" v-for="level in levels" :key="level.level">
              <el-icon :size="32" :color="level.color">
                <Medal />
              </el-icon>
              <div class="level-info">
                <div class="level-name">Lv.{{ level.level }} {{ level.name }}</div>
                <div class="level-requirement">需要 {{ level.points }} 积分</div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 排行榜规则 -->
        <el-card class="rules-card">
          <template #header>
            <div class="card-header">
              <span>排行榜规则</span>
            </div>
          </template>
          <div class="rules-content">
            <ul>
              <li>排行榜每日凌晨0点更新</li>
              <li>积分排行：根据用户总积分排名</li>
              <li>签到排行：根据连续签到天数排名</li>
              <li>学习排行：根据学习时长和完成度排名</li>
              <li>贡献排行：根据发帖、评论等互动排名</li>
              <li>排行榜前100名可获得额外奖励</li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'

export default {
  name: 'Ranking',
  setup() {
    const activeTab = ref('points')
    const myRank = ref(128)

    const myStats = reactive({
      points: 1250,
      level: 5
    })

    const topUsers = reactive([
      {
        id: 1,
        username: '学习之星',
        avatar: 'https://via.placeholder.com/100',
        points: 5280,
        checkinDays: 365,
        learningHours: 520,
        contribution: 890,
        level: 12
      },
      {
        id: 2,
        username: '爱国青年',
        avatar: 'https://via.placeholder.com/100',
        points: 4650,
        checkinDays: 280,
        learningHours: 450,
        contribution: 780,
        level: 11
      },
      {
        id: 3,
        username: '奋斗者',
        avatar: 'https://via.placeholder.com/100',
        points: 3920,
        checkinDays: 210,
        learningHours: 380,
        contribution: 650,
        level: 10
      }
    ])

    const rankedUsers = reactive([
      {
        id: 4,
        username: '追梦人',
        avatar: 'https://via.placeholder.com/100',
        points: 3540,
        checkinDays: 180,
        learningHours: 340,
        contribution: 580,
        level: 9
      },
      {
        id: 5,
        username: '知识达人',
        avatar: 'https://via.placeholder.com/100',
        points: 3280,
        checkinDays: 156,
        learningHours: 310,
        contribution: 520,
        level: 9
      },
      {
        id: 6,
        username: '勤奋小蜜蜂',
        avatar: 'https://via.placeholder.com/100',
        points: 2950,
        checkinDays: 145,
        learningHours: 280,
        contribution: 480,
        level: 8
      },
      {
        id: 7,
        username: '学习标兵',
        avatar: 'https://via.placeholder.com/100',
        points: 2680,
        checkinDays: 132,
        learningHours: 250,
        contribution: 450,
        level: 8
      },
      {
        id: 8,
        username: '进步青年',
        avatar: 'https://via.placeholder.com/100',
        points: 2420,
        checkinDays: 120,
        learningHours: 220,
        contribution: 410,
        level: 7
      }
    ])

    const levels = reactive([
      { level: 1, name: '新手', points: 0, color: '#909399' },
      { level: 2, name: '入门', points: 100, color: '#909399' },
      { level: 3, name: '进阶', points: 300, color: '#67C23A' },
      { level: 4, name: '熟练', points: 600, color: '#67C23A' },
      { level: 5, name: '精通', points: 1000, color: '#409EFF' },
      { level: 6, name: '专家', points: 1500, color: '#409EFF' },
      { level: 7, name: '大师', points: 2000, color: '#E6A23C' },
      { level: 8, name: '宗师', points: 3000, color: '#E6A23C' },
      { level: 9, name: '传说', points: 4000, color: '#F56C6C' },
      { level: 10, name: '神话', points: 5000, color: '#F56C6C' }
    ])

    const levelProgress = computed(() => {
      return Math.floor((myStats.points % 500) / 5)
    })

    const pointsToNextRank = computed(() => {
      return 150 // 模拟数据
    })

    const getRankValue = (user) => {
      switch (activeTab.value) {
        case 'points':
          return user.points
        case 'checkin':
          return user.checkinDays + '天'
        case 'learning':
          return user.learningHours + '小时'
        case 'contribution':
          return user.contribution
        default:
          return user.points
      }
    }

    const getRankLabel = () => {
      switch (activeTab.value) {
        case 'points':
          return '积分'
        case 'checkin':
          return '签到'
        case 'learning':
          return '学习'
        case 'contribution':
          return '贡献'
        default:
          return '积分'
      }
    }

    const getRankClass = (rank) => {
      if (rank <= 10) return 'top-10'
      return ''
    }

    const handleTabChange = () => {
      console.log('切换排行榜类型', activeTab.value)
    }

    return {
      activeTab,
      myRank,
      myStats,
      topUsers,
      rankedUsers,
      levels,
      levelProgress,
      pointsToNextRank,
      getRankValue,
      getRankLabel,
      getRankClass,
      handleTabChange
    }
  }
}
</script>

<style scoped>
.ranking-page {
  max-width: 1400px;
  margin: 0 auto;
}

.tabs-card {
  margin-bottom: 24px;
  text-align: center;
}

.top-three-card {
  margin-bottom: 24px;
}

.top-three {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 40px;
  padding: 40px 20px;
}

.rank-item {
  text-align: center;
  transition: all 0.3s;
}

.rank-item:hover {
  transform: translateY(-8px);
}

.rank-1 {
  order: 2;
}

.rank-2 {
  order: 1;
}

.rank-3 {
  order: 3;
}

.rank-badge {
  margin-bottom: 16px;
}

.badge-img {
  width: 60px;
  height: 60px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.rank-1 .badge-img {
  width: 80px;
  height: 80px;
}

.rank-item h3 {
  font-size: 18px;
  color: #333;
  margin: 16px 0 8px;
}

.rank-score {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.rank-1 .rank-score {
  color: #FFD700;
  font-size: 28px;
}

.rank-2 .rank-score {
  color: #C0C0C0;
}

.rank-3 .rank-score {
  color: #CD7F32;
}

.ranking-list-card {
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
  gap: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 12px;
  transition: all 0.3s;
}

.ranking-item:hover {
  background: #e8eaf0;
  transform: translateX(4px);
}

.rank-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
  font-size: 18px;
  background: white;
  color: #666;
}

.rank-number.top-10 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.user-level {
  font-size: 13px;
  color: #409EFF;
}

.user-score {
  text-align: right;
}

.score-value {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 4px;
}

.score-label {
  font-size: 12px;
  color: #999;
}

.my-rank-card {
  margin-bottom: 24px;
}

.my-rank-content {
  text-align: center;
  padding: 20px 0;
}

.my-rank-content h3 {
  font-size: 20px;
  color: #333;
  margin: 16px 0;
}

.my-rank-number {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 24px;
}

.my-rank-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

.level-progress {
  margin-bottom: 16px;
}

.progress-tip {
  font-size: 14px;
  color: #666;
}

.highlight {
  color: #409EFF;
  font-weight: bold;
  font-size: 18px;
}

.level-info-card {
  margin-bottom: 24px;
}

.level-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.level-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.level-info {
  flex: 1;
}

.level-name {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.level-requirement {
  font-size: 13px;
  color: #666;
}

.rules-card {
  margin-bottom: 24px;
}

.rules-content ul {
  padding-left: 20px;
  margin: 0;
}

.rules-content li {
  color: #666;
  line-height: 2;
  font-size: 14px;
}

@media (max-width: 768px) {
  .top-three {
    flex-direction: column;
    align-items: center;
  }

  .rank-1,
  .rank-2,
  .rank-3 {
    order: initial;
  }

  .my-rank-stats {
    gap: 20px;
  }
}
</style>

