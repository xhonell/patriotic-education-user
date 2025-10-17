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

export default {
  name: 'ArticleDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const hasLiked = ref(false)
    const hasCollected = ref(false)
    const newComment = ref('')

    const article = reactive({
      id: 1,
      title: '新中国成立的伟大历程',
      category: '历史',
      publishDate: '2025-10-15',
      views: 1250,
      likes: 89,
      cover: 'https://via.placeholder.com/1200x600?text=Article+Cover',
      content: `
        <h2>前言</h2>
        <p>1949年10月1日，中华人民共和国成立，开启了中国历史的新纪元。新中国的成立，是中国共产党领导中国人民经过28年浴血奋战取得的伟大胜利。</p>
        
        <h2>开国大典</h2>
        <p>1949年10月1日下午3时，毛泽东主席在天安门城楼上庄严宣告："中华人民共和国中央人民政府今天成立了！"这一刻，标志着中国人民从此站起来了。</p>
        
        <h2>历史意义</h2>
        <p>新中国的成立，结束了一百多年来帝国主义、封建主义、官僚资本主义对中国人民的压迫和剥削，中国人民真正成为国家的主人。</p>
        
        <h2>伟大成就</h2>
        <p>新中国成立以来，在中国共产党的领导下，中国人民创造了世所罕见的经济快速发展和社会长期稳定两大奇迹，中华民族迎来了从站起来、富起来到强起来的伟大飞跃。</p>
        
        <h2>结语</h2>
        <p>回顾历史，我们倍加珍惜今天的幸福生活。作为新时代的青少年，我们要继承和发扬革命先辈的优良传统，为实现中华民族伟大复兴的中国梦而努力奋斗！</p>
      `
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
      e.target.src = 'https://via.placeholder.com/400x300?text=Image'
    }

    onMounted(() => {
      // 模拟学习完成后获得积分
      setTimeout(() => {
        ElMessage.success('恭喜完成学习！+20积分')
      }, 5000)
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
      handleImageError
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
}

.article-content h2 {
  font-size: 24px;
  margin: 32px 0 16px;
  color: #333;
}

.article-content p {
  margin-bottom: 16px;
  text-indent: 2em;
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

