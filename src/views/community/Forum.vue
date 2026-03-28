<template>
  <div class="forum-page">
    <h1 class="page-title">论坛模块</h1>

    <!-- 发帖按钮 -->
    <el-button type="primary" size="large" @click="showPostDialog = true" class="create-post-btn">
      <el-icon><EditPen /></el-icon>
      发表新帖
    </el-button>

    <!-- 筛选栏 -->
    <el-card class="filter-card" :body-style="{ padding: '20px' }">
      <el-radio-group v-model="activeCategory" @change="handleCategoryChange">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button :label="1">讨论</el-radio-button>
        <el-radio-button :label="2">问答</el-radio-button>
        <el-radio-button :label="3">分享</el-radio-button>
        <el-radio-button :label="4">活动</el-radio-button>
      </el-radio-group>
      <el-select v-model="sortType" placeholder="排序方式" style="margin-left: 16px; width: 150px" @change="handleSortChange">
        <el-option label="最新发布" value="latest" />
        <el-option label="最多回复" value="replies" />
        <el-option label="最多观看" value="views" />
      </el-select>
    </el-card>

    <!-- 帖子列表 -->
    <el-card class="posts-card">
      <div class="post-list">
        <div class="post-item" v-for="post in posts" :key="post.id" @click="goToTopic(post.id)">
          <el-avatar :src="post.author.avatar" :size="50">
            <el-icon><User /></el-icon>
          </el-avatar>
          <div class="post-content">
            <div class="post-header">
              <el-tag :type="getCategoryType(post.category)" size="small">
                {{ getCategoryText(post.category) }}
              </el-tag>
              <h3 class="post-title">{{ post.title }}</h3>
            </div>
            <p class="post-summary">{{ post.content }}</p>
            <div class="post-footer">
              <div class="post-author">
                <span class="author-name">{{ post.author.name }}</span>
                <span v-if="post.location" class="post-location">{{ post.location }}</span>
                <span class="post-time">{{ post.time }}</span>
              </div>
              <div class="post-stats">
                <span><el-icon><View /></el-icon> {{ post.views }}</span>
                <span><el-icon><ChatDotRound /></el-icon> {{ post.replies }}</span>
                <span><el-icon><Star /></el-icon> {{ post.likes }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @update:current-page="handleCurrentChange"
        @update:page-size="handleSizeChange"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
      />
    </el-card>

    <!-- 发帖对话框 -->
    <el-dialog v-model="showPostDialog" title="发表新帖" width="700px">
      <el-form :model="postForm" :rules="postRules" ref="postFormRef" label-width="80px">
        <el-form-item label="分类" prop="category">
          <el-select v-model="postForm.category" placeholder="请选择分类">
            <el-option label="讨论" :value="1" />
            <el-option label="问答" :value="2" />
            <el-option label="分享" :value="3" />
            <el-option label="活动" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="postForm.title" placeholder="请输入标题" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="postForm.content"
            type="textarea"
            :rows="10"
            placeholder="请输入内容..."
            maxlength="5000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPostDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitPost" :loading="submitting">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTopicPage, publishTopic } from '@/api/community'

export default {
  name: 'Forum',
  setup() {
    const router = useRouter()
    const activeCategory = ref('all')
    const sortType = ref('latest')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const showPostDialog = ref(false)
    const submitting = ref(false)
    const postFormRef = ref(null)

    const postForm = reactive({
      category: null,
      title: '',
      content: ''
    })

    const postRules = {
      category: [
        { required: true, message: '请选择分类', trigger: 'change' }
      ],
      title: [
        { required: true, message: '请输入标题', trigger: 'blur' },
        { min: 5, max: 100, message: '标题长度为5-100个字符', trigger: 'blur' }
      ],
      content: [
        { required: true, message: '请输入内容', trigger: 'blur' },
        { min: 10, message: '内容不少于10个字符', trigger: 'blur' }
      ]
    }

    const posts = ref([])

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

    const buildOrder = () => {
      const orderMap = {
        latest: 'create_time',
        replies: 'reply_count',
        views: 'view_count'
      }
      return {
        orderBy: orderMap[sortType.value] || 'create_time',
        orderType: 'DESC'
      }
    }

    const fetchTopics = async () => {
      try {
        const order = buildOrder()
        const res = await getTopicPage({
          page: currentPage.value,
          pageSize: pageSize.value,
          category: activeCategory.value === 'all' ? undefined : activeCategory.value,
          orderBy: order.orderBy,
          orderType: order.orderType
        })
        if (res.code === 200 && res.data) {
          const pageData = res.data
          total.value = pageData.total || 0
          posts.value = (pageData.list || []).map(item => ({
            id: item.id,
            category: Number(item.category) || 1,
            title: item.title,
            content: item.content || '',
            author: {
              name: item.userName || '匿名用户',
              avatar: item.avatarUrl || 'https://via.placeholder.com/100'
            },
            location: item.location || '',
            status: Number(item.status),
            time: item.createTime || '',
            views: item.viewCount || 0,
            replies: item.replyCount || 0,
            likes: item.likeCount || 0
          }))
        }
      } catch (error) {
        console.error('获取话题分页失败：', error)
      }
    }

    const handleCategoryChange = () => {
      currentPage.value = 1
      fetchTopics()
    }

    const handleSortChange = () => {
      currentPage.value = 1
      fetchTopics()
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      currentPage.value = 1
      fetchTopics()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      fetchTopics()
    }

    const goToTopic = (id) => {
      router.push(`/topic/${id}`)
    }

    const handleSubmitPost = async () => {
      if (!postFormRef.value) return

      await postFormRef.value.validate(async (valid) => {
        if (!valid) return
        submitting.value = true
        try {
          const res = await publishTopic({
            category: postForm.category,
            title: postForm.title,
            content: postForm.content
          })
          if (res.code === 200) {
            ElMessage.success('发布成功')
            showPostDialog.value = false
            postForm.category = null
            postForm.title = ''
            postForm.content = ''
            currentPage.value = 1
            fetchTopics()
          }
        } catch (error) {
          console.error('发布话题失败：', error)
        } finally {
          submitting.value = false
        }
      })
    }

    onMounted(() => {
      fetchTopics()
    })

    return {
      activeCategory,
      sortType,
      currentPage,
      pageSize,
      total,
      showPostDialog,
      submitting,
      postForm,
      postRules,
      postFormRef,
      posts,
      getCategoryType,
      getCategoryText,
      handleCategoryChange,
      handleSortChange,
      handleSizeChange,
      handleCurrentChange,
      goToTopic,
      handleSubmitPost
    }
  }
}
</script>

<style scoped>
.forum-page {
  max-width: 1200px;
  margin: 0 auto;
}

.create-post-btn {
  margin-bottom: 24px;
}

.filter-card {
  margin-bottom: 24px;
}

.posts-card {
  margin-bottom: 24px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.post-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: #f5f7fa;
}

.post-item:hover {
  background: #e8eaf0;
  transform: translateX(4px);
}

.post-content {
  flex: 1;
  min-width: 0;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-author {
  display: flex;
  gap: 12px;
  font-size: 13px;
}

.author-name {
  color: #409EFF;
  font-weight: bold;
}

.post-location {
  color: #67C23A;
}

.post-time {
  color: #999;
}

.post-stats {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #999;
}

.post-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .post-item {
    flex-direction: column;
  }

  .post-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>

