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
            <span><el-icon><ChatDotRound /></el-icon> {{ replies.length }}</span>
          </div>
        </div>
      </div>

      <!-- 话题内容 -->
      <div class="topic-content" v-html="topic.content"></div>

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
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTopicDetail, getTopicCommentPage, publishTopicComment } from '@/api/community'
import { addPoints } from '@/api/points'

export default {
  name: 'TopicDetail',
  setup() {
    const route = useRoute()
    const newReply = ref('')

    const topic = reactive({
      id: null,
      category: 1,
      title: '',
      author: {
        name: '匿名用户',
        avatar: 'https://via.placeholder.com/100'
      },
      time: '',
      views: 0,
      likes: 0,
      content: ''
    })

    const replies = ref([])

    const getCategoryType = (category) => {
      const typeMap = {
        1: 'primary',
        2: 'warning',
        3: 'success',
        4: 'danger'
      }
      return typeMap[Number(category)] || ''
    }

    const getCategoryText = (category) => {
      const textMap = {
        1: '讨论',
        2: '问答',
        3: '分享',
        4: '活动'
      }
      return textMap[Number(category)] || '未分类'
    }

    const handleReply = async () => {
      if (!newReply.value.trim()) {
        ElMessage.warning('请输入回复内容')
        return
      }

      try {
        const res = await publishTopicComment({
          topicId: Number(route.params.id),
          parentId: null,
          content: newReply.value
        })
        if (res.code === 200) {
          await addPoints({
            sourceType: 3,
            sourceId: String(route.params.id),
            remark: '发表评论',
            points: 10
          })
          newReply.value = ''
          ElMessage.success('回复成功')
          await loadTopicComments()
        }
      } catch (error) {
        console.error('发布评论失败：', error)
      }
    }

    const showReplyDialog = async (reply) => {
      try {
        const { value } = await ElMessageBox.prompt('请输入回复内容', `回复 ${reply.user.name}`, {
          confirmButtonText: '发布',
          cancelButtonText: '取消',
          inputType: 'textarea',
          inputPlaceholder: '写下你的回复...'
        })

        if (!value || !value.trim()) {
          ElMessage.warning('请输入回复内容')
          return
        }

        const res = await publishTopicComment({
          topicId: Number(route.params.id),
          parentId: reply.id,
          content: value.trim()
        })

        if (res.code === 200) {
          await addPoints({
            sourceType: 3,
            sourceId: String(route.params.id),
            remark: '发表评论',
            points: 10
          })
          ElMessage.success('回复成功')
          await loadTopicComments()
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('回复评论失败：', error)
        }
      }
    }

    const loadTopicDetail = async () => {
      try {
        const res = await getTopicDetail(Number(route.params.id))
        if (res.code === 200 && res.data) {
          const data = res.data
          topic.id = data.id
          topic.category = Number(data.category || data.categoryCode) || 1
          topic.title = data.title || ''
          topic.author.name = data.userName || data.authorName || data.author || '匿名用户'
          topic.author.avatar = data.avatarUrl || data.authorAvatar || 'https://via.placeholder.com/100'
          topic.time = data.createTime || ''
          topic.views = data.viewCount || 0
          topic.likes = 0
          topic.content = data.content || ''
        }
      } catch (error) {
        console.error('获取话题详情失败：', error)
      }
    }

    const loadTopicComments = async () => {
      try {
        const res = await getTopicCommentPage({
          topicId: Number(route.params.id),
          page: 1,
          pageSize: 50,
          orderBy: 'create_time',
          orderType: 'DESC'
        })
        if (res.code === 200 && res.data) {
          replies.value = (res.data.list || []).map(item => ({
            id: item.id,
            user: {
              name: item.userName || item.authorName || '匿名用户',
              avatar: item.userAvatar || 'https://via.placeholder.com/100'
            },
            content: item.content || '',
            time: item.createTime || '',
            likes: item.likeCount || 0,
            subReplies: (item.children || []).map(child => ({
              id: child.id,
              user: {
                name: child.userName || child.authorName || '匿名用户',
                avatar: child.userAvatar || 'https://via.placeholder.com/100'
              },
              replyTo: child.replyToUserName || '楼主',
              content: child.content || '',
              time: child.createTime || ''
            }))
          }))
        }
      } catch (error) {
        console.error('获取话题评论失败：', error)
      }
    }

    onMounted(() => {
      loadTopicDetail()
      loadTopicComments()
    })

    return {
      topic,
      replies,
      newReply,
      getCategoryType,
      getCategoryText,
      handleReply,
      showReplyDialog
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

