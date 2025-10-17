<template>
  <div class="video-learning-page">
    <h1 class="page-title">视频学习</h1>

    <!-- 筛选栏 -->
    <el-card class="filter-card" :body-style="{ padding: '20px' }">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="分类">
          <el-select v-model="filterForm.category" placeholder="请选择分类" clearable>
            <el-option label="全部" value="" />
            <el-option label="历史纪录" value="history" />
            <el-option label="科技成就" value="technology" />
            <el-option label="文化传承" value="culture" />
            <el-option label="英雄事迹" value="hero" />
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
              <el-tag size="small" :type="getCategoryType(video.category)">{{ getCategoryText(video.category) }}</el-tag>
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
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[9, 18, 36]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="pagination"
    />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'VideoLearning',
  setup() {
    const router = useRouter()

    const filterForm = reactive({
      category: '',
      duration: '',
      sort: 'latest'
    })

    const currentPage = ref(1)
    const pageSize = ref(9)
    const total = ref(80)

    const videos = reactive([
      {
        id: 1,
        title: '改革开放四十年纪录片',
        summary: '全景展现改革开放的伟大历程和辉煌成就',
        cover: 'https://via.placeholder.com/400x300?text=Video+1',
        duration: '42:35',
        category: 'history',
        views: 2380,
        likes: 156,
        points: 30
      },
      {
        id: 2,
        title: '中国航天事业发展历程',
        summary: '从东方红一号到天宫空间站的辉煌历程',
        cover: 'https://via.placeholder.com/400x300?text=Video+2',
        duration: '28:15',
        category: 'technology',
        views: 1680,
        likes: 142,
        points: 25
      },
      {
        id: 3,
        title: '抗美援朝战争纪实',
        summary: '回顾那段波澜壮阔的历史，致敬英雄',
        cover: 'https://via.placeholder.com/400x300?text=Video+3',
        duration: '55:20',
        category: 'hero',
        views: 3200,
        likes: 289,
        points: 35
      },
      {
        id: 4,
        title: '中华文化瑰宝系列',
        summary: '探索五千年文明的璀璨文化',
        cover: 'https://via.placeholder.com/400x300?text=Video+4',
        duration: '32:48',
        category: 'culture',
        views: 1450,
        likes: 118,
        points: 30
      },
      {
        id: 5,
        title: '新中国工业化建设',
        summary: '从一穷二白到世界工厂的伟大跨越',
        cover: 'https://via.placeholder.com/400x300?text=Video+5',
        duration: '38:22',
        category: 'history',
        views: 1920,
        likes: 165,
        points: 30
      },
      {
        id: 6,
        title: '科技创新引领未来',
        summary: '见证中国科技从跟跑到并跑、领跑',
        cover: 'https://via.placeholder.com/400x300?text=Video+6',
        duration: '25:10',
        category: 'technology',
        views: 2100,
        likes: 178,
        points: 25
      }
    ])

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

    const handleSearch = () => {
      console.log('搜索', filterForm)
    }

    const handleReset = () => {
      filterForm.category = ''
      filterForm.duration = ''
      filterForm.sort = 'latest'
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
    }

    const goToDetail = (id) => {
      router.push(`/video-detail/${id}`)
    }

    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/400x300?text=Video'
    }

    return {
      filterForm,
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

