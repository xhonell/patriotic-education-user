<template>
  <div class="community-page">
    <h1 class="page-title">社区交流</h1>

    <!-- 功能入口 -->
    <el-row justify="center" class="feature-cards">
      <el-col :xs="24" :sm="8" :md="7" :lg="6" class="feature-col" v-for="feature in features" :key="feature.id">
        <el-card class="feature-card" @click="goToFeature(feature.path)">
          <div class="feature-content">
            <el-icon :size="48" :color="feature.color">
              <component :is="feature.icon" />
            </el-icon>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 热门话题 -->
    <el-card class="hot-topics-card">
      <template #header>
        <div class="card-header">
          <span>🔥 热门话题</span>
          <el-link type="primary" @click="goToForum">查看更多</el-link>
        </div>
      </template>
      <div class="topic-list">
        <div class="topic-item" v-for="topic in hotTopics" :key="topic.id" @click="goToTopic(topic.id)">
          <div class="topic-left">
            <el-avatar :src="topic.author.avatar" :size="40">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="topic-info">
              <h4 class="topic-title">{{ topic.title }}</h4>
              <div class="topic-meta">
                <span class="author-name">{{ topic.author.name }}</span>
                <span class="topic-date">{{ topic.date }}</span>
              </div>
            </div>
          </div>
          <div class="topic-right">
            <div class="topic-stats">
              <span><el-icon><View /></el-icon> {{ topic.views }}</span>
              <span><el-icon><ChatDotRound /></el-icon> {{ topic.replies }}</span>
              <span><el-icon><Star /></el-icon> {{ topic.likes }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 最新动态 -->
    <el-row :gutter="20">
      <el-col :xs="24" :lg="24">
        <el-card class="activities-card">
          <template #header>
            <div class="card-header">
              <span>最新动态</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="activity in activities"
              :key="activity.id"
              :timestamp="activity.time"
              placement="top"
            >
              <el-card>
                <div class="activity-content">
                  <el-avatar :src="activity.user.avatar" :size="36">
                    <el-icon><User /></el-icon>
                  </el-avatar>
                  <div class="activity-text">
                    <span class="username">{{ activity.user.name }}</span>
                    {{ activity.description }}
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTopicPage, getLatestActivities } from '@/api/community'

export default {
  name: 'Community',
  setup() {
    const router = useRouter()

    const features = reactive([
      {
        id: 1,
        title: '签到打卡',
        description: '每日签到领积分',
        icon: 'Calendar',
        color: '#409EFF',
        path: '/check-in'
      },
      {
        id: 2,
        title: '话题模块',
        description: '交流学习心得',
        icon: 'ChatDotRound',
        color: '#67C23A',
        path: '/forum'
      },
      {
        id: 4,
        title: '社区等级',
        description: '查看排行榜',
        icon: 'Rank',
        color: '#F56C6C',
        path: '/ranking'
      }
    ])

    const hotTopics = ref([])

    const activities = ref([])

    const announcements = reactive([
      {
        id: 1,
        tag: '置顶',
        type: 'danger',
        title: '社区管理规范及用户行为准则',
        date: '2025-10-15'
      },
      {
        id: 2,
        tag: '活动',
        type: 'warning',
        title: '本月学习之星评选活动开始啦',
        date: '2025-10-16'
      },
      {
        id: 3,
        tag: '更新',
        type: 'success',
        title: '平台新增视频学习功能',
        date: '2025-10-17'
      }
    ])

    const communityStats = reactive([
      { label: '社区成员', value: '10,000+' },
      { label: '今日活跃', value: '2,580' },
      { label: '话题总数', value: '8,000+' },
      { label: '评论总数', value: '50,000+' }
    ])

    const loadHotTopics = async () => {
      try {
        const res = await getTopicPage({
          page: 1,
          pageSize: 3,
          orderBy: 'view_count',
          orderType: 'DESC'
        })
        if (res.code === 200 && res.data) {
          hotTopics.value = (res.data.list || []).map(item => ({
            id: item.id,
            title: item.title,
            author: {
              name: item.userName || '匿名用户',
              avatar: item.avatarUrl || 'https://via.placeholder.com/100'
            },
            date: item.createTime || '',
            views: item.viewCount || 0,
            replies: item.replyCount || 0,
            likes: item.likeCount || 0
          }))
        }
      } catch (error) {
        console.error('获取热门话题失败：', error)
      }
    }

    const formatActivityTime = (value) => {
      if (!value) return ''
      if (typeof value === 'string') return value.replace('T', ' ')
      if (value instanceof Date) return value.toLocaleString('zh-CN')
      return String(value)
    }

    const loadLatestActivities = async () => {
      try {
        const res = await getLatestActivities()
        if (res.code === 200 && Array.isArray(res.data)) {
          activities.value = res.data.map((item, index) => ({
            id: index + 1,
            user: {
              name: item.userName || '匿名用户',
              avatar: item.avatarUrl || 'https://via.placeholder.com/100'
            },
            description: item.description || '',
            time: formatActivityTime(item.createTime)
          }))
        }
      } catch (error) {
        console.error('获取最新动态失败：', error)
      }
    }

    const goToFeature = (path) => {
      router.push(path)
    }

    const goToForum = () => {
      router.push('/forum')
    }

    const goToTopic = (id) => {
      router.push(`/topic/${id}`)
    }

    onMounted(() => {
      loadHotTopics()
      loadLatestActivities()
    })

    return {
      features,
      hotTopics,
      activities,
      announcements,
      communityStats,
      goToFeature,
      goToForum,
      goToTopic
    }
  }
}
</script>

<style scoped>
.community-page {
  max-width: 1400px;
  margin: 0 auto;
}

.feature-cards {
  margin-bottom: 24px;
}

.feature-col {
  padding-left: 10px;
  padding-right: 10px;
}

.feature-card {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.feature-content {
  text-align: center;
  padding: 20px 0;
}

.feature-content h3 {
  font-size: 18px;
  color: #333;
  margin: 16px 0 8px;
}

.feature-content p {
  font-size: 14px;
  color: #666;
}

.hot-topics-card {
  margin-bottom: 24px;
}

.topic-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.topic-item:hover {
  background: #f5f7fa;
  transform: translateX(4px);
}

.topic-left {
  display: flex;
  gap: 12px;
  flex: 1;
}

.topic-info {
  flex: 1;
}

.topic-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.topic-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #999;
}

.author-name {
  color: #409EFF;
}

.topic-right {
  margin-left: 16px;
}

.topic-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #999;
}

.topic-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.activities-card {
  margin-bottom: 24px;
}

.activity-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-text {
  font-size: 14px;
  color: #666;
}

.username {
  color: #409EFF;
  font-weight: bold;
  margin-right: 4px;
}

.target {
  color: #333;
  font-weight: bold;
  margin-left: 4px;
}

.announcement-card {
  margin-bottom: 24px;
}

.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.announcement-item {
  padding: 12px;
  border-radius: 8px;
  background: #f5f7fa;
  cursor: pointer;
  transition: all 0.3s;
}

.announcement-item:hover {
  background: #e8eaf0;
}

.announcement-item h4 {
  font-size: 14px;
  color: #333;
  margin: 8px 0;
}

.announcement-item p {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.stats-card {
  margin-bottom: 24px;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

@media (max-width: 768px) {
  .topic-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .topic-right {
    width: 100%;
    margin-left: 0;
  }

  .topic-stats {
    justify-content: flex-start;
  }
}
</style>

