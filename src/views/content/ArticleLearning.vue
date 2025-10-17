<template>
  <div class="article-learning-page">
    <h1 class="page-title">文章学习</h1>

    <!-- 筛选栏 -->
    <el-card class="filter-card" :body-style="{ padding: '20px' }">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="分类">
          <el-select v-model="filterForm.category" placeholder="请选择分类" clearable>
            <el-option label="全部" value="" />
            <el-option label="历史" value="history" />
            <el-option label="科技" value="technology" />
            <el-option label="文化" value="culture" />
            <el-option label="英雄人物" value="hero" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-select v-model="filterForm.difficulty" placeholder="请选择难度" clearable>
            <el-option label="全部" value="" />
            <el-option label="入门" value="easy" />
            <el-option label="进阶" value="medium" />
            <el-option label="深入" value="hard" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="filterForm.sort" placeholder="排序方式">
            <el-option label="最新发布" value="latest" />
            <el-option label="最多浏览" value="views" />
            <el-option label="最多点赞" value="likes" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 文章列表 -->
    <el-row :gutter="20" class="article-list">
      <el-col :xs="24" :sm="12" :md="8" v-for="article in articles" :key="article.id">
        <el-card class="article-card" :body-style="{ padding: '0' }" @click="goToDetail(article.id)">
          <div class="article-cover">
            <img :src="article.cover" :alt="article.title" @error="handleImageError" />
            <div class="article-overlay">
              <el-button type="primary" size="small" circle>
                <el-icon><Reading /></el-icon>
              </el-button>
            </div>
          </div>
          <div class="article-body">
            <div class="article-tags">
              <el-tag size="small" :type="getCategoryType(article.category)">{{ article.category }}</el-tag>
              <el-tag size="small" type="info">{{ getDifficultyText(article.difficulty) }}</el-tag>
            </div>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-footer">
              <div class="article-meta">
                <span><el-icon><View /></el-icon> {{ article.views }}</span>
                <span><el-icon><Star /></el-icon> {{ article.likes }}</span>
              </div>
              <div class="article-points">
                <el-icon color="#F56C6C"><TrophyBase /></el-icon>
                <span>+{{ article.points }}积分</span>
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
  name: 'ArticleLearning',
  setup() {
    const router = useRouter()

    const filterForm = reactive({
      category: '',
      difficulty: '',
      sort: 'latest'
    })

    const currentPage = ref(1)
    const pageSize = ref(9)
    const total = ref(100)

    const articles = reactive([
      {
        id: 1,
        title: '新中国成立的伟大历程',
        summary: '回顾新中国成立以来的辉煌历史，感受祖国的强大',
        cover: 'https://via.placeholder.com/400x300?text=Article+1',
        category: '历史',
        difficulty: 'easy',
        views: 1250,
        likes: 89,
        points: 20
      },
      {
        id: 2,
        title: '科技强国之路',
        summary: '探索中国科技创新的发展历程，见证中国智造的崛起',
        cover: 'https://via.placeholder.com/400x300?text=Article+2',
        category: '科技',
        difficulty: 'medium',
        views: 980,
        likes: 72,
        points: 25
      },
      {
        id: 3,
        title: '抗美援朝战争中的英雄事迹',
        summary: '回顾那段波澜壮阔的历史，致敬最可爱的人',
        cover: 'https://via.placeholder.com/400x300?text=Article+3',
        category: '英雄人物',
        difficulty: 'easy',
        views: 1560,
        likes: 123,
        points: 20
      },
      {
        id: 4,
        title: '中华优秀传统文化传承',
        summary: '感受五千年文明的魅力，传承中华文化瑰宝',
        cover: 'https://via.placeholder.com/400x300?text=Article+4',
        category: '文化',
        difficulty: 'medium',
        views: 850,
        likes: 65,
        points: 25
      },
      {
        id: 5,
        title: '改革开放四十年的伟大成就',
        summary: '见证中国改革开放的历史进程和辉煌成就',
        cover: 'https://via.placeholder.com/400x300?text=Article+5',
        category: '历史',
        difficulty: 'hard',
        views: 2100,
        likes: 178,
        points: 30
      },
      {
        id: 6,
        title: '航天精神：从东方红到天宫',
        summary: '探索中国航天事业的发展历程和伟大成就',
        cover: 'https://via.placeholder.com/400x300?text=Article+6',
        category: '科技',
        difficulty: 'medium',
        views: 1680,
        likes: 142,
        points: 25
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

    const getDifficultyText = (difficulty) => {
      const textMap = {
        'easy': '入门',
        'medium': '进阶',
        'hard': '深入'
      }
      return textMap[difficulty] || ''
    }

    const handleSearch = () => {
      console.log('搜索', filterForm)
    }

    const handleReset = () => {
      filterForm.category = ''
      filterForm.difficulty = ''
      filterForm.sort = 'latest'
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
    }

    const goToDetail = (id) => {
      router.push(`/article-detail/${id}`)
    }

    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/400x300?text=Image'
    }

    return {
      filterForm,
      currentPage,
      pageSize,
      total,
      articles,
      getCategoryType,
      getDifficultyText,
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
.article-learning-page {
  max-width: 1400px;
  margin: 0 auto;
}

.filter-card {
  margin-bottom: 24px;
}

.article-list {
  margin-bottom: 24px;
}

.article-card {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
  height: 100%;
  overflow: hidden;
}

.article-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.article-cover {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-card:hover .article-cover img {
  transform: scale(1.1);
}

.article-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.article-card:hover .article-overlay {
  opacity: 1;
}

.article-body {
  padding: 20px;
}

.article-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.article-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.article-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #999;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-points {
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

