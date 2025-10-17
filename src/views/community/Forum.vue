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
        <el-radio-button label="discuss">讨论</el-radio-button>
        <el-radio-button label="share">分享</el-radio-button>
        <el-radio-button label="question">问答</el-radio-button>
        <el-radio-button label="activity">活动</el-radio-button>
      </el-radio-group>
      <el-select v-model="sortType" placeholder="排序方式" style="margin-left: 16px; width: 150px">
        <el-option label="最新发布" value="latest" />
        <el-option label="最多回复" value="replies" />
        <el-option label="最多点赞" value="likes" />
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
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
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
            <el-option label="讨论" value="discuss" />
            <el-option label="分享" value="share" />
            <el-option label="问答" value="question" />
            <el-option label="活动" value="activity" />
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'Forum',
  setup() {
    const router = useRouter()
    const activeCategory = ref('all')
    const sortType = ref('latest')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(100)
    const showPostDialog = ref(false)
    const submitting = ref(false)
    const postFormRef = ref(null)

    const postForm = reactive({
      category: '',
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

    const posts = reactive([
      {
        id: 1,
        category: 'share',
        title: '学习《改革开放四十年》纪录片的心得体会',
        content: '今天看完了这部纪录片，深深感受到改革开放给中国带来的翻天覆地的变化...',
        author: { name: '爱国青年', avatar: 'https://via.placeholder.com/100' },
        time: '2小时前',
        views: 580,
        replies: 45,
        likes: 89
      },
      {
        id: 2,
        category: 'discuss',
        title: '讨论：新时代青年如何传承爱国主义精神',
        content: '作为新时代的青年，我们应该如何在日常生活中践行爱国主义精神？欢迎大家分享自己的想法...',
        author: { name: '学习之星', avatar: 'https://via.placeholder.com/100' },
        time: '5小时前',
        views: 1200,
        replies: 98,
        likes: 156
      },
      {
        id: 3,
        category: 'question',
        title: '如何系统地学习中国近现代史？',
        content: '想要系统地学习中国近现代史，有什么好的学习方法和资料推荐吗？',
        author: { name: '历史爱好者', avatar: 'https://via.placeholder.com/100' },
        time: '1天前',
        views: 420,
        replies: 32,
        likes: 67
      },
      {
        id: 4,
        category: 'activity',
        title: '【活动】本月学习之星评选开始啦！',
        content: '本月学习之星评选活动正式启动，快来参与吧！评选标准包括学习时长、互动参与度等...',
        author: { name: '管理员', avatar: 'https://via.placeholder.com/100' },
        time: '2天前',
        views: 2500,
        replies: 180,
        likes: 320
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

    const handleCategoryChange = () => {
      console.log('切换分类', activeCategory.value)
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
    }

    const goToTopic = (id) => {
      router.push(`/topic/${id}`)
    }

    const handleSubmitPost = async () => {
      if (!postFormRef.value) return

      await postFormRef.value.validate(async (valid) => {
        if (valid) {
          submitting.value = true

          // 模拟提交
          setTimeout(() => {
            ElMessage.success('发布成功！+15积分')
            showPostDialog.value = false
            submitting.value = false

            // 重置表单
            postForm.category = ''
            postForm.title = ''
            postForm.content = ''
          }, 1000)
        }
      })
    }

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

