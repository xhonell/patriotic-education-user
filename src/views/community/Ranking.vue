<template>
  <div class="ranking-page">
    <h1 class="page-title">社区等级排行榜</h1>


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
              <el-avatar :src="topThreeUsers[1].avatar" :size="80">
                <el-icon><User /></el-icon>
              </el-avatar>
              <h3>{{ topThreeUsers[1].userName }} <el-tag v-if="topThreeUsers[1].isMe" size="small" type="danger">本人</el-tag></h3>
              <div class="rank-score">{{ getRankValue(topThreeUsers[1]) }}</div>
            </div>

            <!-- 第一名 -->
            <div class="rank-item rank-1">
              <div class="rank-badge">
                <img src="https://via.placeholder.com/120x120?text=1" alt="第一名" class="badge-img" />
              </div>
              <el-avatar :src="topThreeUsers[0].avatar" :size="100">
                <el-icon><User /></el-icon>
              </el-avatar>
              <h3>{{ topThreeUsers[0].userName }} <el-tag v-if="topThreeUsers[0].isMe" size="small" type="danger">本人</el-tag></h3>
              <div class="rank-score">{{ getRankValue(topThreeUsers[0]) }}</div>
            </div>

            <!-- 第三名 -->
            <div class="rank-item rank-3">
              <div class="rank-badge">
                <img src="https://via.placeholder.com/100x100?text=3" alt="第三名" class="badge-img" />
              </div>
              <el-avatar :src="topThreeUsers[2].avatar" :size="80">
                <el-icon><User /></el-icon>
              </el-avatar>
              <h3>{{ topThreeUsers[2].userName }} <el-tag v-if="topThreeUsers[2].isMe" size="small" type="danger">本人</el-tag></h3>
              <div class="rank-score">{{ getRankValue(topThreeUsers[2]) }}</div>
            </div>
          </div>
        </el-card>

        <!-- 排行榜列表 -->
        <el-card class="ranking-list-card">
          <div class="ranking-list">
            <div class="ranking-item" v-for="user in rankedUsers" :key="user.userId || user.ranking">
              <div class="rank-number" :class="getRankClass(user.ranking)">
                {{ user.ranking }}
              </div>
              <el-avatar :src="user.avatar" :size="48">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="user-info">
                <div class="user-name">{{ user.userName }} <el-tag v-if="user.isMe" size="small" type="danger">本人</el-tag></div>
                <div class="user-level">Lv.{{ calcLevel(user.points) }} {{ getLevelName(calcLevel(user.points)) }}</div>
              </div>
              <div class="user-score">
                <span class="score-value">{{ getRankValue(user) }}</span>
                <span class="score-label">{{ getRankLabel() }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="ranking-list-card">
          <el-pagination
            :current-page="page"
            :page-size="pageSize"
            :total="total"
            layout="total, prev, pager, next"
            @current-change="handlePageChange"
          />
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
                <div class="stat-value">Lv.{{ myStats.level }} {{ getLevelName(myStats.level) }}</div>
                <div class="stat-label">等级</div>
              </div>
            </div>
            <el-progress
              :percentage="levelProgress"
              :stroke-width="12"
              :text-inside="true"
              class="level-progress"
            />
            <p class="progress-tip" v-if="myRank === 1">已是第一名，继续保持！</p>
            <p class="progress-tip" v-else>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getPointsRanking } from '@/api/points'

export default {
  name: 'Ranking',
  setup() {
    const myRank = ref('--')
    const page = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    const myStats = reactive({
      points: 0,
      level: 1
    })

    const userStore = useUserStore()

    const topUsers = ref([])
    const rankedUsers = ref([])

    const levelConfigs = [
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
    ]

    const calcLevel = (points = 0) => {
      const value = Number(points || 0)
      let level = 1
      levelConfigs.forEach(item => {
        if (value >= item.points) {
          level = item.level
        }
      })
      return level
    }

    const getLevelName = (level) => {
      return levelConfigs.find(item => item.level === level)?.name || '新手'
    }

    const topThreeUsers = computed(() => {
      const fallback = { userName: '-', avatar: '', points: 0, isMe: false }
      return [topUsers.value[0] || fallback, topUsers.value[1] || fallback, topUsers.value[2] || fallback]
    })

    const levels = reactive(levelConfigs.map(item => ({ ...item })))

    const levelProgress = computed(() => {
      const currentLevel = calcLevel(myStats.points)
      const currentStart = levels[currentLevel - 1]?.points ?? 0
      const nextStart = levels[currentLevel]?.points ?? (currentStart + 1000)
      const span = Math.max(1, nextStart - currentStart)
      const progressed = Math.max(0, myStats.points - currentStart)
      return Math.min(100, Math.floor((progressed / span) * 100))
    })

    const loadRanking = async () => {
      try {
        const res = await getPointsRanking({ page: page.value, pageSize: pageSize.value })
        if (res.code === 200 && res.data) {
          const pageData = res.data
          const list = pageData.list || pageData.records || []
          total.value = Number(pageData.total || list.length || 0)

          const mapped = list.map(item => ({
            ranking: item.ranking,
            userId: item.userId,
            userName: item.userName || '匿名用户',
            avatar: item.avatarUrl || 'https://via.placeholder.com/100',
            points: Number(item.points || 0),
            isMe: Number(item.userId) === Number(userStore.userInfo?.id)
          }))

          topUsers.value = mapped.slice(0, 3)
          rankedUsers.value = mapped.filter(item => Number(item.ranking) > 3)

          const me = mapped.find(item => item.isMe)
          if (me) {
            myRank.value = me.ranking
            myStats.points = me.points
            myStats.level = calcLevel(me.points)
          }
        }
      } catch (error) {
        console.error('获取积分排行榜失败：', error)
      }
    }

    const handlePageChange = (val) => {
      page.value = val
      loadRanking()
    }

    const pointsToNextRank = computed(() => {
      const rankValue = Number(myRank.value)
      if (!rankValue || rankValue <= 1) return 0
      const me = [...topUsers.value, ...rankedUsers.value].find(item => item.isMe)
      if (!me) return 0
      const above = [...topUsers.value, ...rankedUsers.value].find(item => Number(item.ranking) === rankValue - 1)
      if (!above) return 0
      return Math.max(0, Number(above.points || 0) - Number(me.points || 0) + 1)
    })

    const getRankValue = (user) => user.points

    const getRankLabel = () => '积分'

    const getRankClass = (rank) => {
      if (rank <= 10) return 'top-10'
      return ''
    }

    onMounted(() => {
      loadRanking()
    })

    return {
      myRank,
      myStats,
      topUsers,
      topThreeUsers,
      rankedUsers,
      page,
      pageSize,
      total,
      levels,
      levelProgress,
      pointsToNextRank,
      getRankValue,
      getRankLabel,
      getRankClass,
      calcLevel,
      getLevelName,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.ranking-page {
  max-width: 1400px;
  margin: 0 auto;
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

