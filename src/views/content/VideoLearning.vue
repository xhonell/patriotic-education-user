<template>
  <div class="video-learning-page">
    <h1 class="page-title">视频学习</h1>

    <!-- 筛选栏 -->
    <el-card class="filter-card" :body-style="{ padding: '20px' }">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="分类">
          <el-select v-model="filterForm.category" placeholder="请选择分类" clearable>
            <el-option label="全部" value="" />
            <el-option v-for="option in categoryOptions" :key="option.id" :label="option.name" :value="option.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="时长">
          <el-select v-model="filterForm.duration" placeholder="请选择时长" clearable>
            <el-option label="全部" value="" />
            <el-option label="10分钟以内" value="short" />
            <el-option label="10-30分钟" value="medium" />
            <el-option label="30分钟以上" value="long" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="filterForm.sort" placeholder="排序方式">
            <el-option label="最新发布" value="latest" />
            <el-option label="最多观看" value="views" />
            <el-option label="最多点赞" value="likes" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 视频列表 -->
    <el-row :gutter="20" class="video-list">
      <el-col :xs="24" :sm="12" :md="8" v-for="video in videos" :key="video.id">
        <el-card class="video-card" :body-style="{ padding: '0' }" @click="goToDetail(video.id)">
          <div class="video-cover">
            <img :src="video.cover" :alt="video.title" @error="handleImageError" />
            <div class="video-overlay">
              <el-button type="primary" size="large" circle>
                <el-icon :size="24"><VideoPlay /></el-icon>
              </el-button>
            </div>
            <div class="video-duration">{{ video.duration }}</div>
          </div>
          <div class="video-body">
            <h3 class="video-title">{{ video.title }}</h3>
            <p class="video-summary">{{ video.summary }}</p>
            <div class="video-tags">
              <el-tag size="small" :type="getCategoryType(video.tagId)">{{ video.tagName || '未标签' }}</el-tag>
            </div>
            <div class="video-footer">
              <div class="video-meta">
                <span><el-icon><View /></el-icon> {{ video.views }}</span>
                <span><el-icon><Star /></el-icon> {{ video.likes }}</span>
              </div>
              <div class="video-points">
                <el-icon color="#F56C6C"><TrophyBase /></el-icon>
                <span>+{{ video.points }}积分</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[9, 18, 36]"
      layout="total, sizes, prev, pager, next, jumper"
      @update:current-page="handleCurrentChange"
      @update:page-size="handleSizeChange"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="pagination"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getVideoPage } from '@/api/content'

export default {
  name: 'VideoLearning',
  setup() {
    const router = useRouter()

    const filterForm = reactive({
      category: '',
      duration: '',
      sort: 'latest'
    })

    const categoryOptions = ref([])

    const currentPage = ref(1)
    const pageSize = ref(9)
    const total = ref(0)

    const videos = ref([])

    const getCategoryType = (category) => {
      const typeMap = {
        1: 'danger',
        2: 'success',
        3: 'warning',
        4: 'primary'
      }
      return typeMap[category] || ''
    }

    const getCategoryText = (category) => {
      const option = categoryOptions.value.find(item => item.id === category)
      return option ? option.name : '未分类'
    }

    const formatDuration = (seconds) => {
      if (!seconds && seconds !== 0) return '00:00'
      const minutes = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    const buildPageRequest = () => {
      let minDuration
      let maxDuration
      if (filterForm.duration === 'short') {
        maxDuration = 600
      } else if (filterForm.duration === 'medium') {
        minDuration = 600
        maxDuration = 1800
      } else if (filterForm.duration === 'long') {
        minDuration = 1800
      }

      const sortByMap = {
        latest: 1,
        likes: 2,
        views: 3
      }

      return {
        page: currentPage.value,
        pageSize: pageSize.value,
        categoryId: filterForm.category || undefined,
        minDuration,
        maxDuration,
        sortBy: sortByMap[filterForm.sort] || 1
      }
    }

    const fetchVideos = async () => {
      try {
        const res = await getVideoPage(buildPageRequest())
        if (res.code === 200 && res.data) {
          const data = res.data
          total.value = data.total || 0
          videos.value = (data.videos || []).map(item => ({
            id: item.id,
            title: item.title,
            summary: item.description || item.reason || '精彩视频推荐',
            cover: item.fileUrl || item.coverUrl || 'https://via.placeholder.com/400x300?text=Video',
            duration: formatDuration(item.duration),
            category: item.categoryId || '',
            categoryName: item.categoryName || '',
            tagId: item.tagId || '',
            tagName: item.tagName || '',
            views: item.viewCount || 0,
            likes: item.likeCount || 0,
            points: item.difficultyScore ?? (item.score ? Math.round(item.score) : 30)
          }))
          fetchCategoryOptions()
        }
      } catch (error) {
        console.error('获取视频列表失败：', error)
      }
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchVideos()
    }

    const handleReset = () => {
      filterForm.category = ''
      filterForm.duration = ''
      filterForm.sort = 'latest'
      currentPage.value = 1
      fetchVideos()
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      currentPage.value = 1
      fetchVideos()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      fetchVideos()
    }

    const goToDetail = (id) => {
      router.push(`/video-detail/${id}`)
    }

    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/400x300?text=Video'
    }

    const fetchCategoryOptions = () => {
      const map = new Map()
      videos.value.forEach(item => {
        if (item.category && !map.has(item.category)) {
          map.set(item.category, {
            id: item.category,
            name: item.categoryName || `分类${item.category}`
          })
        }
      })
      categoryOptions.value = Array.from(map.values())
    }

    onMounted(async () => {
      await fetchVideos()
      fetchCategoryOptions()
    })

    return {
      filterForm,
      categoryOptions,
      currentPage,
      pageSize,
      total,
      videos,
      getCategoryType,
      getCategoryText,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      goToDetail,
      handleImageError
    }
  }
}
</script>

<style scoped>
.video-learning-page {
  max-width: 1400px;
  margin: 0 auto;
}

.filter-card {
  margin-bottom: 24px;
}

.video-list {
  margin-bottom: 24px;
}

.video-card {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
  height: 100%;
  overflow: hidden;
}

.video-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.video-cover {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.video-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.video-card:hover .video-cover img {
  transform: scale(1.1);
}

.video-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.video-card:hover .video-overlay {
  opacity: 1;
}

.video-duration {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.video-body {
  padding: 20px;
}

.video-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.video-tags {
  margin-bottom: 16px;
}

.video-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.video-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #999;
}

.video-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.video-points {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: bold;
  color: #F56C6C;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>

