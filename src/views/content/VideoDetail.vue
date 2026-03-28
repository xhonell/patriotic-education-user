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
              ref="videoRef"
              :src="video.videoUrl"
              class="video-element"
              controls
              preload="metadata"
              poster=""
              @timeupdate="handleVideoTimeUpdate"
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
            <el-button type="primary" size="large" @click="handleLike">
              <el-icon><StarFilled /></el-icon>
              {{ hasLiked ? '已点赞' : '点赞' }}
            </el-button>
            <el-button size="large" @click="handleCollect">
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
              <span>评论区 ({{ commentTotal }})</span>
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
                  <el-tag
                    v-if="comment.isMine"
                    size="small"
                    type="success"
                    effect="plain"
                    style="margin-left: 8px"
                  >本人</el-tag>
                  <span class="comment-date">{{ comment.date }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
                <div class="comment-actions">
                  <el-button
                    v-if="canDeleteComment(comment)"
                    type="text"
                    size="small"
                    @click="handleDeleteComment(comment.id)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <el-pagination
            v-model:current-page="commentPage"
            v-model:page-size="commentPageSize"
            :total="commentTotal"
            :page-sizes="[5, 10, 20]"
            layout="total, sizes, prev, pager, next"
            @size-change="() => { commentPage = 1; fetchComments() }"
            @current-change="fetchComments"
            class="pagination"
            style="margin-top: 16px"
          />
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
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getVideoDetailById, getRecommendList } from '@/api/content'
import { deleteComment, getCommentPage, publishComment } from '@/api/comment'
import {
  getInteractionStatus,
  handleCollect as handleCollectApi,
  handleLike as handleLikeApi
} from '@/api/like'
import { addPoints } from '@/api/points'
import { useUserStore } from '@/stores/user'

export default {
  name: 'VideoDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    const hasLiked = ref(false)
    const hasCollected = ref(false)
    const newComment = ref('')
    const videoRef = ref(null)

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
      coverUrl: '',
      learningPoints: 30
    })

    const commentTotal = ref(0)
    const commentPage = ref(1)
    const commentPageSize = ref(10)
    const comments = ref([])

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

    const grantPoints = async ({ sourceType, sourceId, remark, points }) => {
      try {
        const res = await addPoints({ sourceType, sourceId: String(sourceId), remark, points })
        if (res.code === 200 && res.data) {
          const addVal = res.data.changePoints ?? points ?? 0
          ElMessage.success(`${remark} +${addVal} 积分，当前积分：${res.data.afterPoints ?? '--'}`)
        }
      } catch (e) {
        console.error('增加积分失败：', e)
      }
    }

    const handleLike = async () => {
      try {
        const operation = hasLiked.value ? 0 : 1
        await handleLikeApi({
          contentId: Number(route.params.id),
          operation
        })
        hasLiked.value = !hasLiked.value
        video.likes = Math.max(0, video.likes + (operation === 1 ? 1 : -1))
        if (operation === 1) {
          await grantPoints({
            sourceType: '4',
            sourceId: route.params.id,
            remark: '点赞内容',
            points: 5
          })
        }
        ElMessage.success(operation === 1 ? '点赞成功！' : '已取消点赞')
      } catch (e) {
        console.error('点赞操作失败：', e)
      }
    }

    const handleCollect = async () => {
      try {
        const operation = hasCollected.value ? 0 : 1
        await handleCollectApi({
          contentId: Number(route.params.id),
          operation
        })
        hasCollected.value = !hasCollected.value
        if (operation === 1) {
          await grantPoints({
            sourceType: '5',
            sourceId: route.params.id,
            remark: '收藏内容',
            points: 5
          })
        }
        ElMessage.success(operation === 1 ? '收藏成功！' : '已取消收藏')
      } catch (e) {
        console.error('收藏操作失败：', e)
      }
    }

    const handleShare = () => {
      ElMessage.success('分享链接已复制到剪贴板')
    }

    const formatPublishDate = (value) => {
      if (!value) return ''
      if (typeof value === 'string') return value.replace('T', ' ')
      if (value instanceof Date) return value.toLocaleString('zh-CN')
      return String(value)
    }

    const normalizeComment = (item) => {
      const itemUserId = item.userId ?? item.createBy ?? item.uid ?? item.createUserId ?? null
      const uid = userStore?.userInfo?.id
      const isMine = uid != null && itemUserId != null && String(uid) === String(itemUserId)

      return {
        id: item.id,
        userId: itemUserId,
        isMine,
        username: item.username || item.userName || item.nickName || item.createName || '匿名用户',
        avatar: item.avatarUrl || item.avatar || item.userAvatar || '',
        content: item.content || item.comment || '',
        date: formatPublishDate(item.createTime || item.createAt || item.createdAt || item.time),
        likes: item.likeCount || item.likes || 0
      }
    }

    const buildCommentPageRequest = () => ({
      page: commentPage.value,
      pageSize: commentPageSize.value,
      contentId: Number(route.params.id),
      status: 1
    })

    const fetchComments = async () => {
      try {
        const res = await getCommentPage(buildCommentPageRequest())
        if (res.code === 200 && res.data) {
          const data = res.data
          commentTotal.value = data.total || 0
          comments.value = (data.list || data.records || []).map(normalizeComment)
        }
      } catch (e) {
        console.error('获取视频评论失败：', e)
      }
    }

    const handleComment = async () => {
      if (!newComment.value.trim()) {
        ElMessage.warning('请输入评论内容')
        return
      }

      try {
        const content = newComment.value.trim()
        await publishComment({
          contentId: Number(route.params.id),
          content
        })
        await grantPoints({
          sourceType: '3',
          sourceId: route.params.id,
          remark: '发表评论',
          points: 10
        })
        newComment.value = ''
        commentPage.value = 1
        ElMessage.success('评论成功！')
        await fetchComments()
      } catch (e) {
        console.error('发表评论失败：', e)
      }
    }

    const canDeleteComment = (comment) => Boolean(comment?.isMine)

    const handleDeleteComment = async (id) => {
      try {
        await deleteComment(id)
        ElMessage.success('删除成功')
        await fetchComments()
      } catch (e) {
        console.error('删除评论失败：', e)
      }
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
          video.learningPoints =
            data.difficultyScore ?? data.learningPoints ?? data.learnPoints ?? data.points ?? data.pointValue ?? 30
        }
      } catch (error) {
        console.error('获取视频详情失败：', error)
      }
    }

    const fetchInteractionStatus = async () => {
      try {
        const contentId = Number(route.params.id)
        if (!contentId) return
        const res = await getInteractionStatus({ contentId })
        if (res.code === 200 && res.data) {
          hasLiked.value = Boolean(res.data.isLiked)
          hasCollected.value = Boolean(res.data.isCollected)
        }
      } catch (error) {
        console.error('获取互动状态失败：', error)
      }
    }

    const fetchRecommendations = async () => {
      try {
        const res = await getRecommendList()
        if (res.code === 200 && res.data) {
          const currentId = Number(route.params.id)
          recommendations.value = res.data
            .filter(item => item.type === 2 && item.id !== currentId)
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

    const grantedLearningPoints = ref(false)

    const grantLearningPointsOnce = async () => {
      if (grantedLearningPoints.value) return
      const id = route.params.id
      if (!id) return
      grantedLearningPoints.value = true
      await grantPoints({
        sourceType: '2',
        sourceId: id,
        remark: '视频学习',
        points: video.learningPoints
      })
    }

    const handleVideoTimeUpdate = () => {
      const el = videoRef.value
      if (!el || !el.duration || Number.isNaN(el.duration)) return
      if (el.currentTime >= el.duration / 3) {
        grantLearningPointsOnce()
      }
    }

    onMounted(() => {
      fetchVideoDetail()
      fetchInteractionStatus()
      fetchRecommendations()
      fetchComments()
    })

    onBeforeUnmount(() => {
      const el = videoRef.value
      if (el) {
        el.removeEventListener('timeupdate', handleVideoTimeUpdate)
      }
    })

    return {
      video,
      comments,
      commentTotal,
      commentPage,
      commentPageSize,
      recommendations,
      hasLiked,
      hasCollected,
      newComment,
      videoRef,
      getCategoryType,
      getCategoryText,
      handleLike,
      handleCollect,
      handleShare,
      handleComment,
      handleVideoTimeUpdate,
      canDeleteComment,
      handleDeleteComment,
      goToVideo,
      fetchComments,
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

