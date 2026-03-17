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
              <span class="comment-date">{{ comment.date }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-actions">
              <el-button type="text" size="small">
                <el-icon><ChatDotRound /></el-icon>
                回复
              </el-button>
              <el-button type="text" size="small">
                <el-icon><Star /></el-icon>
                {{ comment.likes }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getArticleDetail } from '@/api/content'

export default {
  name: 'ArticleDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
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
      source: ''
    })

    const comments = reactive([
      {
        id: 1,
        username: '小明同学',
        avatar: 'https://via.placeholder.com/100',
        content: '学习了这篇文章，深刻感受到新中国成立的不易，我们要倍加珍惜今天的幸福生活！',
        date: '2025-10-17 10:30',
        likes: 12
      },
      {
        id: 2,
        username: '爱国青年',
        avatar: 'https://via.placeholder.com/100',
        content: '革命先辈用鲜血和生命换来了今天的和平与幸福，我们要努力学习，报效祖国！',
        date: '2025-10-16 15:20',
        likes: 8
      }
    ])

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

    const handleLike = () => {
      hasLiked.value = true
      article.likes++
      ElMessage.success('点赞成功！+5积分')
    }

    const handleCollect = () => {
      hasCollected.value = true
      ElMessage.success('收藏成功！')
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
        }
      } catch (error) {
        console.error('获取文章详情失败：', error)
      }
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
        date: new Date().toLocaleString('zh-CN'),
        likes: 0
      })

      newComment.value = ''
      ElMessage.success('评论成功！+10积分')
    }

    const goToArticle = (id) => {
      router.push(`/article-detail/${id}`)
    }

    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/400x300?text=Article'
    }

    onMounted(() => {
      fetchArticleDetail()
    })

    return {
      article,
      comments,
      recommendations,
      hasLiked,
      hasCollected,
      newComment,
      getCategoryType,
      handleLike,
      handleCollect,
      handleShare,
      handleComment,
      goToArticle,
      handleImageError,
      fetchArticleDetail
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

