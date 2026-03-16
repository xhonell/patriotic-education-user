<template>
  <div class="video-detail-page">
    <el-row :gutter="24">
      <!-- 主要内容区域 -->
      <el-col :xs="24" :lg="16">
        <el-card class="video-card">
          <!-- 视频播放器 -->
          <div class="video-player">
            <video
              v-if="video.videoUrl"
              :src="video.videoUrl"
              class="video-element"
              controls
              preload="metadata"
              poster=""
            />
            <div v-else class="video-placeholder">
              <el-icon :size="80" color="#fff"><VideoPlay /></el-icon>
              <p>视频加载中...</p>
            </div>
          </div>

          <!-- 视频信息 -->
          <div class="video-info">
            <h1 class="video-title">{{ video.title }}</h1>
            <div class="video-meta">
              <el-tag :type="getCategoryType(video.category)" size="large">
                {{ getCategoryText(video.category) }}
              </el-tag>
              <span class="meta-item">
                <el-icon><Clock /></el-icon>
                {{ video.publishDate }}
              </span>
              <span class="meta-item">
                <el-icon><View /></el-icon>
                {{ video.views }} 观看
              </span>
              <span class="meta-item">
                <el-icon><Star /></el-icon>
                {{ video.likes }} 点赞
              </span>
              <span class="meta-item">
                <el-icon><Timer /></el-icon>
                {{ video.duration }}
              </span>
            </div>
          </div>

          <!-- 视频描述 -->
          <div class="video-description">
            <h3>视频简介</h3>
            <p>{{ video.description }}</p>
          </div>

          <!-- 操作按钮 -->
          <div class="video-actions">
            <el-button type="primary" size="large" @click="handleLike" :disabled="hasLiked">
              <el-icon><StarFilled /></el-icon>
              {{ hasLiked ? '已点赞' : '点赞' }}
            </el-button>
            <el-button size="large" @click="handleCollect" :disabled="hasCollected">
              <el-icon><Collection /></el-icon>
              {{ hasCollected ? '已收藏' : '收藏' }}
            </el-button>
            <el-button size="large" @click="handleShare">
              <el-icon><Share /></el-icon>
              分享
            </el-button>
          </div>
        </el-card>

        <!-- 评论区 -->
        <el-card class="comment-card">
          <template #header>
            <div class="card-header">
              <span>评论区 ({{ comments.length }})</span>
            </div>
          </template>

          <!-- 发表评论 -->
          <div class="comment-input">
            <el-input
              v-model="newComment"
              type="textarea"
              :rows="3"
              placeholder="分享你的观后感..."
            />
            <el-button type="primary" @click="handleComment" style="margin-top: 12px">发表评论</el-button>
          </div>

          <!-- 评论列表 -->
          <div class="comment-list">
            <div class="comment-item" v-for="comment in comments" :key="comment.id">
              <el-avatar :src="comment.avatar" :size="40">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-user">{{ comment.username }}</span>
                  <span class="comment-date">{{ comment.date }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 侧边栏 -->
      <el-col :xs="24" :lg="8">
        <el-card class="recommend-card">
          <template #header>
            <div class="card-header">
              <span>相关推荐</span>
            </div>
          </template>
          <div class="recommend-list">
            <div class="recommend-item" v-for="item in recommendations" :key="item.id" @click="goToVideo(item.id)">
              <div class="recommend-cover">
                <img :src="item.cover" :alt="item.title" @error="handleImageError" />
                <div class="recommend-duration">{{ item.duration }}</div>
              </div>
              <div class="recommend-info">
                <h4>{{ item.title }}</h4>
                <p class="recommend-meta">
                  <span><el-icon><View /></el-icon> {{ item.views }}</span>
                </p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getVideoDetailById, getRecommendVideos } from '@/api/content'

export default {
  name: 'VideoDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const hasLiked = ref(false)
    const hasCollected = ref(false)
    const newComment = ref('')

    const video = reactive({
      id: null,
      title: '',
      category: null,
      publishDate: '',
      views: 0,
      likes: 0,
      duration: '00:00',
      description: '',
      videoUrl: '',
      coverUrl: ''
    })

    const comments = reactive([
      {
        id: 1,
        username: '爱国青年',
        avatar: 'https://via.placeholder.com/100',
        content: '看完这个纪录片，深深感受到改革开放的伟大意义，为祖国的发展感到骄傲！',
        date: '2025-10-17 10:30'
      },
      {
        id: 2,
        username: '历史爱好者',
        avatar: 'https://via.placeholder.com/100',
        content: '非常震撼的纪录片，让我更加了解了改革开放的历史进程！',
        date: '2025-10-16 15:20'
      }
    ])

    const recommendations = ref([])

    const getCategoryType = (category) => {
      const typeMap = {
        'history': 'danger',
        'technology': 'success',
        'culture': 'warning',
        'hero': 'primary'
      }
      return typeMap[category] || ''
    }

    const getCategoryText = (category) => {
      const textMap = {
        'history': '历史纪录',
        'technology': '科技成就',
        'culture': '文化传承',
        'hero': '英雄事迹'
      }
      return textMap[category] || ''
    }

    const handleLike = () => {
      hasLiked.value = true
      video.likes++
      ElMessage.success('点赞成功！+5积分')
    }

    const handleCollect = () => {
      hasCollected.value = true
      ElMessage.success('收藏成功！')
    }

    const handleShare = () => {
      ElMessage.success('分享链接已复制到剪贴板')
    }

    const handleComment = () => {
      if (!newComment.value.trim()) {
        ElMessage.warning('请输入评论内容')
        return
      }

      comments.unshift({
        id: Date.now(),
        username: '当前用户',
        avatar: 'https://via.placeholder.com/100',
        content: newComment.value,
        date: new Date().toLocaleString('zh-CN')
      })

      newComment.value = ''
      ElMessage.success('评论成功！+10积分')
    }

    const goToVideo = (id) => {
      router.push(`/video-detail/${id}`)
      window.scrollTo(0, 0)
    }

    const formatDuration = (seconds) => {
      if (!seconds && seconds !== 0) return '00:00'
      const minutes = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    const fetchVideoDetail = async () => {
      try {
        const id = route.params.id
        if (!id) return
        const res = await getVideoDetailById(id)
        if (res.code === 200 && res.data) {
          const data = res.data
          video.id = data.id
          video.title = data.title
          video.category = data.categoryId || data.tagId
          video.publishDate = data.createTime ? data.createTime.split('T')[0] : ''
          video.views = data.viewCount || 0
          video.likes = data.likeCount || 0
          video.duration = formatDuration(data.duration)
          video.description = data.description || data.reason || ''
          video.videoUrl = data.coverUrl || ''
          video.coverUrl = data.fileUrl || ''
        }
      } catch (error) {
        console.error('获取视频详情失败：', error)
      }
    }

    const fetchRecommendations = async () => {
      try {
        const res = await getRecommendVideos()
        if (res.code === 200 && res.data) {
          const currentId = Number(route.params.id)
          recommendations.value = res.data
            .filter(item => item.id !== currentId)
            .slice(0, 6)
            .map(item => ({
              id: item.id,
              title: item.title,
              cover: item.fileUrl || item.coverUrl || 'https://via.placeholder.com/200x150?text=Video',
              duration: formatDuration(item.duration),
              views: item.viewCount || 0
            }))
        }
      } catch (error) {
        console.error('获取推荐视频失败：', error)
      }
    }

    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/200x150?text=Video'
    }

    onMounted(() => {
      fetchVideoDetail()
      fetchRecommendations()
    })

    return {
      video,
      comments,
      recommendations,
      hasLiked,
      hasCollected,
      newComment,
      getCategoryType,
      getCategoryText,
      handleLike,
      handleCollect,
      handleShare,
      handleComment,
      goToVideo,
      handleImageError
    }
  }
}
</script>

<style scoped>
.video-detail-page {
  max-width: 1400px;
  margin: 0 auto;
}

.video-card {
  margin-bottom: 24px;
}

.video-player {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
}

.video-element {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  background: #000;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  gap: 16px;
}

.video-placeholder p {
  font-size: 16px;
  opacity: 0.8;
}

.video-info {
  margin-bottom: 24px;
}

.video-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.video-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #999;
  font-size: 14px;
}

.video-description {
  margin-bottom: 24px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.video-description h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
}

.video-description p {
  font-size: 15px;
  line-height: 1.8;
  color: #666;
}

.video-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.comment-card {
  margin-bottom: 24px;
}

.comment-input {
  margin-bottom: 32px;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comment-item {
  display: flex;
  gap: 16px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-user {
  font-weight: bold;
  color: #333;
}

.comment-date {
  font-size: 13px;
  color: #999;
}

.comment-text {
  color: #666;
  line-height: 1.6;
}

.recommend-card {
  margin-bottom: 24px;
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommend-item {
  cursor: pointer;
  transition: all 0.3s;
}

.recommend-item:hover {
  opacity: 0.8;
}

.recommend-cover {
  position: relative;
  width: 100%;
  height: 140px;
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.recommend-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recommend-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.recommend-info h4 {
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.recommend-meta {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 992px) {
  .recommend-card {
    margin-top: 24px;
  }
}

@media (max-width: 768px) {
  .video-title {
    font-size: 20px;
  }
}
</style>

