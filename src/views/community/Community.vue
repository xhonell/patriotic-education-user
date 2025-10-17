<template>
  <div class="community-page">
    <h1 class="page-title">社区交流</h1>

    <!-- 功能入口 -->
    <el-row :gutter="20" class="feature-cards">
      <el-col :xs="12" :sm="6" v-for="feature in features" :key="feature.id">
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
      <el-col :xs="24" :lg="16">
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
                    {{ activity.action }}
                    <span class="target">《{{ activity.target }}》</span>
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <!-- 社区公告 -->
      <el-col :xs="24" :lg="8">
        <el-card class="announcement-card">
          <template #header>
            <div class="card-header">
              <span>📢 社区公告</span>
            </div>
          </template>
          <div class="announcement-list">
            <div class="announcement-item" v-for="item in announcements" :key="item.id">
              <el-tag :type="item.type" size="small">{{ item.tag }}</el-tag>
              <h4>{{ item.title }}</h4>
              <p>{{ item.date }}</p>
            </div>
          </div>
        </el-card>

        <!-- 社区数据 -->
        <el-card class="stats-card">
          <template #header>
            <div class="card-header">
              <span>社区数据</span>
            </div>
          </template>
          <div class="stats-list">
            <div class="stat-item" v-for="stat in communityStats" :key="stat.label">
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-value">{{ stat.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

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
        title: '论坛模块',
        description: '交流学习心得',
        icon: 'ChatDotRound',
        color: '#67C23A',
        path: '/forum'
      },
      {
        id: 3,
        title: '话题模块',
        description: '参与热门讨论',
        icon: 'Comment',
        color: '#E6A23C',
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

    const hotTopics = reactive([
      {
        id: 1,
        title: '学习《改革开放四十年》纪录片的心得体会',
        author: { name: '爱国青年', avatar: 'https://via.placeholder.com/100' },
        date: '2小时前',
        views: 580,
        replies: 45,
        likes: 89
      },
      {
        id: 2,
        title: '分享我的学习计划：如何系统学习爱国主义教育内容',
        author: { name: '学习之星', avatar: 'https://via.placeholder.com/100' },
        date: '5小时前',
        views: 420,
        replies: 32,
        likes: 67
      },
      {
        id: 3,
        title: '讨论：新时代青年如何传承爱国主义精神',
        author: { name: '追梦人', avatar: 'https://via.placeholder.com/100' },
        date: '1天前',
        views: 1200,
        replies: 98,
        likes: 156
      }
    ])

    const activities = reactive([
      {
        id: 1,
        user: { name: '小明', avatar: 'https://via.placeholder.com/100' },
        action: '发表了评论在文章',
        target: '新中国成立的伟大历程',
        time: '10分钟前'
      },
      {
        id: 2,
        user: { name: '小红', avatar: 'https://via.placeholder.com/100' },
        action: '完成了视频学习',
        target: '改革开放四十年',
        time: '30分钟前'
      },
      {
        id: 3,
        user: { name: '小华', avatar: 'https://via.placeholder.com/100' },
        action: '发布了新话题',
        target: '学习心得分享',
        time: '1小时前'
      },
      {
        id: 4,
        user: { name: '小强', avatar: 'https://via.placeholder.com/100' },
        action: '完成了每日签到',
        target: '连续签到第7天',
        time: '2小时前'
      }
    ])

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

    const goToFeature = (path) => {
      router.push(path)
    }

    const goToForum = () => {
      router.push('/forum')
    }

    const goToTopic = (id) => {
      router.push(`/topic/${id}`)
    }

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

