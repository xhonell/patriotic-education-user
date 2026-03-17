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
              <el-tag size="small" type="info">{{ article.tagName || '未标签' }}</el-tag>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleList } from '@/api/content'

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
    const total = ref(0)

    const articles = ref([])


    const sortByMap = {
      latest: 1,
      likes: 2,
      views: 3
    }

    const buildPageRequest = () => ({
      page: currentPage.value,
      pageSize: pageSize.value,
      categoryId: filterForm.category || undefined,
      sortBy: sortByMap[filterForm.sort] || 1
    })

    const fetchArticles = async () => {
      try {
        const res = await getArticleList(buildPageRequest())
        if (res.code === 200 && res.data) {
          const data = res.data
          total.value = data.total || 0
          articles.value = (data.articles || []).map(item => ({
            id: item.id,
            title: item.title,
            summary: item.description || item.reason || '精彩文章推荐',
            cover: item.fileUrl || item.coverUrl || 'https://via.placeholder.com/400x300?text=Article',
            tagName: item.tagName || '',
            views: item.viewCount || 0,
            likes: item.likeCount || 0,
            points: item.difficultyScore ?? (item.score ? Math.round(item.score) : 20)
          }))
        }
      } catch (error) {
        console.error('获取文章列表失败：', error)
      }
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchArticles()
    }

    const handleReset = () => {
      filterForm.category = ''
      filterForm.difficulty = ''
      filterForm.sort = 'latest'
      currentPage.value = 1
      fetchArticles()
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      currentPage.value = 1
      fetchArticles()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      fetchArticles()
    }

    const goToDetail = (id) => {
      router.push(`/article-detail/${id}`)
    }

    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/400x300?text=Article'
    }

    onMounted(() => {
      fetchArticles()
    })

    return {
      filterForm,
      currentPage,
      pageSize,
      total,
      articles,
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
  line-clamp: 2;
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

