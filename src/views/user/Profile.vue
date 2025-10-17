<template>
  <div class="profile-page">
    <h1 class="page-title">个人信息编辑</h1>

    <div class="profile-container">
      <el-card class="profile-card">
        <div class="avatar-section">
          <el-avatar :size="120" :src="userInfo.avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <el-button type="primary" size="small" style="margin-top: 16px">更换头像</el-button>
        </div>

        <el-form :model="userInfo" :rules="rules" ref="formRef" label-width="100px" class="profile-form">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userInfo.username" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userInfo.email" />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userInfo.phone" />
          </el-form-item>

          <el-form-item label="性别">
            <el-radio-group v-model="userInfo.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="生日">
            <el-date-picker
              v-model="userInfo.birthday"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="个性签名">
            <el-input
              v-model="userInfo.signature"
              type="textarea"
              :rows="3"
              placeholder="请输入个性签名"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSave" :loading="loading">保存修改</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="stats-card">
        <template #header>
          <div class="card-header">
            <span>我的统计</span>
          </div>
        </template>
        <div class="stats-list">
          <div class="stat-item">
            <el-icon :size="32" color="#409EFF"><TrophyBase /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ userInfo.points }}</div>
              <div class="stat-label">积分</div>
            </div>
          </div>
          <div class="stat-item">
            <el-icon :size="32" color="#67C23A"><Reading /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.articles }}</div>
              <div class="stat-label">学习文章</div>
            </div>
          </div>
          <div class="stat-item">
            <el-icon :size="32" color="#E6A23C"><VideoCamera /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.videos }}</div>
              <div class="stat-label">学习视频</div>
            </div>
          </div>
          <div class="stat-item">
            <el-icon :size="32" color="#F56C6C"><ChatDotRound /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.posts }}</div>
              <div class="stat-label">发表帖子</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

export default {
  name: 'Profile',
  setup() {
    const userStore = useUserStore()
    const formRef = ref(null)
    const loading = ref(false)

    const userInfo = reactive({
      username: '',
      email: '',
      phone: '',
      avatar: '',
      gender: 'male',
      birthday: '',
      signature: '',
      points: 0
    })

    const stats = reactive({
      articles: 45,
      videos: 32,
      posts: 18
    })

    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ]
    }

    const loadUserInfo = () => {
      Object.assign(userInfo, userStore.userInfo)
    }

    const handleSave = async () => {
      if (!formRef.value) return
      
      await formRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          
          // 模拟保存API调用
          setTimeout(() => {
            userStore.updateUserInfo(userInfo)
            ElMessage.success('保存成功！')
            loading.value = false
          }, 1000)
        }
      })
    }

    const handleReset = () => {
      loadUserInfo()
      ElMessage.info('已重置')
    }

    onMounted(() => {
      loadUserInfo()
    })

    return {
      userInfo,
      stats,
      rules,
      formRef,
      loading,
      handleSave,
      handleReset
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.profile-card {
  padding: 24px;
}

.avatar-section {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #eee;
}

.profile-form {
  max-width: 600px;
}

.stats-card {
  height: fit-content;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

@media (max-width: 968px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
}
</style>

