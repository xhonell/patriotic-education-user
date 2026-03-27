<template>
  <div class="article-detail-page">
    <el-card class="article-card">
      <!-- 文章头部 -->
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <el-tag :type="getCategoryType(article.category)" size="large">{{ article.category }}</el-tag>
          <span class="meta-item">
            <el-icon><Clock /></el-icon>
            {{ article.publishDate }}
          </span>
          <span class="meta-item">
            <el-icon><View /></el-icon>
            {{ article.views }} 浏览
          </span>
          <span class="meta-item">
            <el-icon><Star /></el-icon>
            {{ article.likes }} 点赞
          </span>
          <span class="meta-item" v-if="article.author">
            <el-icon><User /></el-icon>
            {{ article.author }}
          </span>
          <span class="meta-item" v-if="article.source">
            <el-icon><Document /></el-icon>
            {{ article.source }}
          </span>
        </div>
      </div>

      <!-- 文章封面 -->
      <div class="article-cover">
        <img :src="article.cover" :alt="article.title" @error="handleImageError" />
      </div>

      <!-- 文章内容 -->
      <div class="article-content" v-html="article.content"></div>

      <!-- 文章操作 -->
      <div class="article-actions">
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
          placeholder="写下你的学习感悟..."
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

    <!-- 推荐阅读 -->
    <el-card class="recommend-card">
      <template #header>
        <div class="card-header">
          <span>推荐阅读</span>
        </div>
      </template>
      <div class="recommend-list">
        <div class="recommend-item" v-for="item in recommendations" :key="item.id" @click="goToArticle(item.id)">
          <img :src="item.cover" :alt="item.title" @error="handleImageError" />
          <div class="recommend-info">
            <h4>{{ item.title }}</h4>
            <p>{{ item.summary }}</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getArticleDetail } from '@/api/content'
import { deleteComment, getCommentPage, publishComment } from '@/api/comment'
import {
  getInteractionStatus,
  handleCollect as handleCollectApi,
  handleLike as handleLikeApi
} from '@/api/like'
import { addPoints } from '@/api/points'
import { useUserStore } from '@/stores/user'

export default {
  name: 'ArticleDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    const hasLiked = ref(false)
    const hasCollected = ref(false)
    const newComment = ref('')

    const article = reactive({
      id: null,
      title: '',
      category: '',
      publishDate: '',
      views: 0,
      likes: 0,
      cover: '',
      content: '',
      author: '',
      source: '',
      learningPoints: 20
    })

    const commentTotal = ref(0)
    const commentPage = ref(1)
    const commentPageSize = ref(10)
    const comments = ref([])

    const recommendations = reactive([
      {
        id: 2,
        title: '改革开放四十年的伟大成就',
        summary: '见证中国改革开放的历史进程',
        cover: 'https://via.placeholder.com/200x150?text=Recommend+1'
      },
      {
        id: 3,
        title: '抗美援朝战争中的英雄事迹',
        summary: '致敬最可爱的人',
        cover: 'https://via.placeholder.com/200x150?text=Recommend+2'
      },
      {
        id: 4,
        title: '科技强国之路',
        summary: '探索中国科技创新的发展历程',
        cover: 'https://via.placeholder.com/200x150?text=Recommend+3'
      }
    ])

    const getCategoryType = (category) => {
      const typeMap = {
        '历史': 'danger',
        '科技': 'success',
        '文化': 'warning',
        '英雄人物': 'primary'
      }
      return typeMap[category] || ''
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
        article.likes = Math.max(0, article.likes + (operation === 1 ? 1 : -1))
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

    const fetchArticleDetail = async () => {
      try {
        const id = route.params.id
        if (!id) return
        const res = await getArticleDetail(id)
        if (res.code === 200 && res.data) {
          const data = res.data
          article.id = data.id
          article.title = data.title || ''
          article.category = data.categoryName || '未分类'
          article.publishDate = formatPublishDate(data.createTime)
          article.views = data.viewCount || 0
          article.likes = data.likeCount || 0
          article.cover = data.fileUrl || data.coverUrl || 'https://via.placeholder.com/1200x600?text=Article'
          article.content = data.content || ''
          article.author = data.author || ''
          article.source = data.source || ''
          article.learningPoints =
            data.difficultyScore ?? data.learningPoints ?? data.learnPoints ?? data.points ?? data.pointValue ?? 20
        }
      } catch (error) {
        console.error('获取文章详情失败：', error)
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

    const handleComment = () => {
      if (!newComment.value.trim()) {
        ElMessage.warning('请输入评论内容')
        return
      }
      doPublishComment()
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
      // 只查正常评论；如果你后端用别的状态约定，改这里即可
      status: 1
      // userId: userStore.userInfo.id // 若需要“只看我的评论”，再打开
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
        console.error('获取评论失败：', e)
      }
    }

    const doPublishComment = async () => {
      try {
        const content = newComment.value.trim()
        const id = route.params.id
        await publishComment({
          contentId: Number(id),
          content
        })
        await grantPoints({
          sourceType: '3',
          sourceId: id,
          remark: '发表评论',
          points: 10
        })
        newComment.value = ''
        ElMessage.success('评论成功！')
        commentPage.value = 1
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

    const goToArticle = (id) => {
      router.push(`/article-detail/${id}`)
    }

    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/400x300?text=Article'
    }

    const grantedLearningPoints = ref(false)
    let articleLearningTimer = null

    const grantLearningPointsOnce = async () => {
      if (grantedLearningPoints.value) return
      const id = route.params.id
      if (!id) return
      grantedLearningPoints.value = true
      await grantPoints({
        sourceType: '1',
        sourceId: id,
        remark: '文章学习',
        points: article.learningPoints
      })
    }

    onMounted(() => {
      fetchArticleDetail()
      fetchInteractionStatus()
      fetchComments()
      articleLearningTimer = setTimeout(() => {
        grantLearningPointsOnce()
      }, 10000)
    })

    onBeforeUnmount(() => {
      if (articleLearningTimer) {
        clearTimeout(articleLearningTimer)
        articleLearningTimer = null
      }
    })

    return {
      article,
      comments,
      commentTotal,
      commentPage,
      commentPageSize,
      recommendations,
      hasLiked,
      hasCollected,
      newComment,
      getCategoryType,
      handleLike,
      handleCollect,
      handleShare,
      handleComment,
      canDeleteComment,
      handleDeleteComment,
      goToArticle,
      handleImageError,
      fetchArticleDetail,
      fetchComments
    }
  }
}
</script>

<style scoped>
.article-detail-page {
  max-width: 1000px;
  margin: 0 auto;
}

.article-card {
  margin-bottom: 24px;
}

.article-header {
  margin-bottom: 24px;
}

.article-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.4;
}

.article-meta {
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

.article-cover {
  width: 100%;
  height: 400px;
  margin-bottom: 32px;
  border-radius: 12px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 32px;
  overflow-x: hidden;
}

.article-content * {
  box-sizing: border-box;
}

.article-content p {
  margin: 0 0 16px;
  text-indent: 2em;
}

.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4,
.article-content h5,
.article-content h6 {
  margin: 24px 0 12px;
  line-height: 1.4;
  font-weight: 600;
  text-align: center;
}

.article-content h1 {
  font-size: 22px;
}

.article-content ul,
.article-content ol {
  margin: 0 0 16px 24px;
  padding: 0;
}

.article-content li {
  margin: 6px 0;
}

.article-content blockquote {
  margin: 16px 0;
  padding: 8px 16px;
  border-left: 4px solid #e5e5e5;
  background: #fafafa;
  color: #666;
}

.article-content img {
  max-width: 100% !important;
  width: 100% !important;
  height: auto !important;
  display: block;
  margin: 12px auto;
  object-fit: contain;
}

.article-content table {
  width: 100%;
  border-collapse: collapse;
}

.article-content table th,
.article-content table td {
  border: 1px solid #eee;
  padding: 8px 12px;
}

.article-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 32px 0;
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
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 16px;
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
  display: flex;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.recommend-item:hover {
  background: #f5f5f5;
}

.recommend-item img {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.recommend-info {
  flex: 1;
}

.recommend-info h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.recommend-info p {
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

@media (max-width: 768px) {
  .article-title {
    font-size: 24px;
  }

  .article-cover {
    height: 250px;
  }

  .article-content {
    font-size: 15px;
  }
}
</style>

