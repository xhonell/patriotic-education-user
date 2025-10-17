<template>
  <div class="topic-detail-page">
    <el-card class="topic-card">
      <!-- 话题头部 -->
      <div class="topic-header">
        <el-tag :type="getCategoryType(topic.category)" size="large">
          {{ getCategoryText(topic.category) }}
        </el-tag>
        <h1 class="topic-title">{{ topic.title }}</h1>
        <div class="topic-meta">
          <el-avatar :src="topic.author.avatar" :size="40">
            <el-icon><User /></el-icon>
          </el-avatar>
          <div class="author-info">
            <span class="author-name">{{ topic.author.name }}</span>
            <span class="topic-time">发表于 {{ topic.time }}</span>
          </div>
          <div class="topic-stats">
            <span><el-icon><View /></el-icon> {{ topic.views }}</span>
            <span><el-icon><Star /></el-icon> {{ topic.likes }}</span>
          </div>
        </div>
      </div>

      <!-- 话题内容 -->
      <div class="topic-content" v-html="topic.content"></div>

      <!-- 话题操作 -->
      <div class="topic-actions">
        <el-button type="primary" @click="handleLike" :disabled="hasLiked">
          <el-icon><StarFilled /></el-icon>
          {{ hasLiked ? '已点赞' : '点赞' }} ({{ topic.likes }})
        </el-button>
        <el-button @click="handleCollect" :disabled="hasCollected">
          <el-icon><Collection /></el-icon>
          {{ hasCollected ? '已收藏' : '收藏' }}
        </el-button>
        <el-button @click="handleShare">
          <el-icon><Share /></el-icon>
          分享
        </el-button>
      </div>
    </el-card>

    <!-- 回复区 -->
    <el-card class="reply-card">
      <template #header>
        <div class="card-header">
          <span>全部回复 ({{ replies.length }})</span>
        </div>
      </template>

      <!-- 发表回复 -->
      <div class="reply-input">
        <el-input
          v-model="newReply"
          type="textarea"
          :rows="4"
          placeholder="写下你的想法..."
        />
        <el-button type="primary" @click="handleReply" style="margin-top: 12px">发表回复</el-button>
      </div>

      <!-- 回复列表 -->
      <div class="reply-list">
        <div class="reply-item" v-for="reply in replies" :key="reply.id">
          <el-avatar :src="reply.user.avatar" :size="40">
            <el-icon><User /></el-icon>
          </el-avatar>
          <div class="reply-content">
            <div class="reply-header">
              <span class="reply-user">{{ reply.user.name }}</span>
              <span class="reply-time">{{ reply.time }}</span>
            </div>
            <p class="reply-text">{{ reply.content }}</p>
            <div class="reply-actions">
              <el-button type="text" size="small" @click="showReplyDialog(reply)">
                <el-icon><ChatDotRound /></el-icon>
                回复
              </el-button>
              <el-button type="text" size="small" @click="likeReply(reply)">
                <el-icon><Star /></el-icon>
                {{ reply.likes }}
              </el-button>
            </div>

            <!-- 子回复 -->
            <div class="sub-replies" v-if="reply.subReplies && reply.subReplies.length">
              <div class="sub-reply-item" v-for="subReply in reply.subReplies" :key="subReply.id">
                <el-avatar :src="subReply.user.avatar" :size="32">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <div class="sub-reply-content">
                  <div class="sub-reply-header">
                    <span class="reply-user">{{ subReply.user.name }}</span>
                    <span class="reply-to">回复</span>
                    <span class="reply-user">{{ subReply.replyTo }}</span>
                    <span class="reply-time">{{ subReply.time }}</span>
                  </div>
                  <p class="sub-reply-text">{{ subReply.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'TopicDetail',
  setup() {
    const route = useRoute()
    const hasLiked = ref(false)
    const hasCollected = ref(false)
    const newReply = ref('')

    const topic = reactive({
      id: 1,
      category: 'share',
      title: '学习《改革开放四十年》纪录片的心得体会',
      author: {
        name: '爱国青年',
        avatar: 'https://via.placeholder.com/100'
      },
      time: '2025-10-17 14:30',
      views: 580,
      likes: 89,
      content: `
        <p>今天看完了《改革开放四十年》这部纪录片，内心久久不能平静，深深感受到改革开放给中国带来的翻天覆地的变化。</p>
        
        <h3>一、改革开放的伟大意义</h3>
        <p>1978年，党的十一届三中全会召开，开启了改革开放的伟大征程。四十年来，中国从一个贫穷落后的农业国发展成为世界第二大经济体，这是人类历史上最伟大的经济奇迹。</p>
        
        <h3>二、人民生活的巨大变化</h3>
        <p>改革开放让人民的生活发生了翻天覆地的变化。从吃不饱穿不暖，到现在的小康生活；从自行车王国，到高铁网络遍布全国；从通信不便，到现在的移动互联网时代。这些变化都离不开改革开放的伟大决策。</p>
        
        <h3>三、对当代青年的启示</h3>
        <p>作为新时代的青年，我们要继承和发扬改革开放精神，勇于创新、敢于拼搏，为实现中华民族伟大复兴的中国梦而努力奋斗！</p>
        
        <p>这是我的一点浅见，欢迎大家一起讨论交流！</p>
      `
    })

    const replies = reactive([
      {
        id: 1,
        user: {
          name: '学习之星',
          avatar: 'https://via.placeholder.com/100'
        },
        content: '说得太好了！改革开放确实改变了中国，改变了我们的生活。作为青年一代，我们更应该珍惜现在的幸福生活，努力学习，报效祖国！',
        time: '2小时前',
        likes: 12,
        subReplies: [
          {
            id: 11,
            user: {
              name: '爱国青年',
              avatar: 'https://via.placeholder.com/100'
            },
            replyTo: '学习之星',
            content: '是的，我们要倍加珍惜！',
            time: '1小时前'
          }
        ]
      },
      {
        id: 2,
        user: {
          name: '历史爱好者',
          avatar: 'https://via.placeholder.com/100'
        },
        content: '这部纪录片我也看了，非常震撼！特别是看到那些老照片和历史影像，真的能感受到时代的变迁。推荐大家都去看看！',
        time: '3小时前',
        likes: 8,
        subReplies: []
      },
      {
        id: 3,
        user: {
          name: '奋斗者',
          avatar: 'https://via.placeholder.com/100'
        },
        content: '改革开放是当代中国最显著的特征、最壮丽的气象。我们要坚定不移地推进改革开放，让中国更加繁荣富强！',
        time: '5小时前',
        likes: 15,
        subReplies: []
      }
    ])

    const getCategoryType = (category) => {
      const typeMap = {
        'discuss': 'primary',
        'share': 'success',
        'question': 'warning',
        'activity': 'danger'
      }
      return typeMap[category] || ''
    }

    const getCategoryText = (category) => {
      const textMap = {
        'discuss': '讨论',
        'share': '分享',
        'question': '问答',
        'activity': '活动'
      }
      return textMap[category] || ''
    }

    const handleLike = () => {
      hasLiked.value = true
      topic.likes++
      ElMessage.success('点赞成功！+2积分')
    }

    const handleCollect = () => {
      hasCollected.value = true
      ElMessage.success('收藏成功！')
    }

    const handleShare = () => {
      ElMessage.success('分享链接已复制到剪贴板')
    }

    const handleReply = () => {
      if (!newReply.value.trim()) {
        ElMessage.warning('请输入回复内容')
        return
      }

      replies.unshift({
        id: Date.now(),
        user: {
          name: '当前用户',
          avatar: 'https://via.placeholder.com/100'
        },
        content: newReply.value,
        time: '刚刚',
        likes: 0,
        subReplies: []
      })

      newReply.value = ''
      ElMessage.success('回复成功！+10积分')
    }

    const showReplyDialog = (reply) => {
      ElMessage.info('回复功能开发中...')
    }

    const likeReply = (reply) => {
      reply.likes++
      ElMessage.success('点赞成功！')
    }

    return {
      topic,
      replies,
      hasLiked,
      hasCollected,
      newReply,
      getCategoryType,
      getCategoryText,
      handleLike,
      handleCollect,
      handleShare,
      handleReply,
      showReplyDialog,
      likeReply
    }
  }
}
</script>

<style scoped>
.topic-detail-page {
  max-width: 1000px;
  margin: 0 auto;
}

.topic-card {
  margin-bottom: 24px;
}

.topic-header {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.topic-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 16px 0;
  line-height: 1.4;
}

.topic-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.author-name {
  font-size: 15px;
  font-weight: bold;
  color: #409EFF;
}

.topic-time {
  font-size: 13px;
  color: #999;
}

.topic-stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #999;
}

.topic-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.topic-content {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 32px;
}

.topic-content h3 {
  font-size: 20px;
  margin: 24px 0 16px;
  color: #333;
}

.topic-content p {
  margin-bottom: 16px;
  text-indent: 2em;
}

.topic-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 32px 0;
  border-top: 1px solid #eee;
}

.reply-card {
  margin-bottom: 24px;
}

.reply-input {
  margin-bottom: 32px;
}

.reply-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.reply-item {
  display: flex;
  gap: 16px;
}

.reply-content {
  flex: 1;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.reply-user {
  font-weight: bold;
  color: #409EFF;
}

.reply-time {
  font-size: 13px;
  color: #999;
}

.reply-text {
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.reply-actions {
  display: flex;
  gap: 16px;
}

.sub-replies {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sub-reply-item {
  display: flex;
  gap: 12px;
}

.sub-reply-content {
  flex: 1;
}

.sub-reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
}

.reply-to {
  color: #999;
}

.sub-reply-text {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .topic-title {
    font-size: 20px;
  }

  .topic-meta {
    flex-wrap: wrap;
  }

  .topic-content {
    font-size: 15px;
  }
}
</style>

