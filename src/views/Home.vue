<template>
  <div class="home">
    <!-- 轮播图 -->
    <el-carousel height="400px" class="banner" v-if="banners.length > 0">
      <el-carousel-item v-for="item in banners" :key="item.id">
        <div class="banner-item" :style="{ 
          backgroundImage: item.filePathUrl ? `url(${item.filePathUrl})` : item.color,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }">
          <div class="banner-title">
            <h2>{{ item.title }}</h2>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 推荐内容 -->
    <div class="section">
      <h2 class="section-title">
        <el-icon><Star /></el-icon>
        为你推荐
      </h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in recommendations" :key="item.id">
          <div class="content-card" @click="goToDetail(item)">
            <div class="content-cover">
              <img :src="item.cover" :alt="item.title" @error="handleImageError" />
              <span class="content-type">{{ item.type }}</span>
            </div>
            <div class="content-info">
              <h3 class="content-title">{{ item.title }}</h3>
              <p class="content-desc">{{ item.description }}</p>
              <div class="content-meta">
                <span><el-icon><View /></el-icon> {{ item.views }}</span>
                <span><el-icon><StarFilled /></el-icon> {{ item.likes }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 热门文章 -->
    <div class="section">
      <h2 class="section-title">
        <el-icon><Reading /></el-icon>
        热门文章
      </h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" v-for="article in hotArticles" :key="article.id">
          <div class="article-item" @click="goToArticle(article.id)">
            <img :src="article.cover" :alt="article.title" class="article-cover" @error="handleImageError" />
            <div class="article-content">
              <h3>{{ article.title }}</h3>
              <p>{{ article.summary }}</p>
              <div class="article-meta">
                <span class="tag tag-red">{{ article.category }}</span>
                <span>{{ article.date }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 数据统计 -->
    <div class="section stats-section">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="6" v-for="stat in stats" :key="stat.label">
          <div class="stat-card">
            <el-icon :size="40" :color="stat.color">
              <component :is="stat.icon" />
            </el-icon>
            <h3>{{ stat.value }}</h3>
            <p>{{ stat.label }}</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBannerList } from '@/api/content'
import { ElMessage } from 'element-plus'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()

    // 轮播图数据（从后端获取）
    const banners = ref([])
    
    // 默认的背景渐变色
    const defaultColors = [
      'linear-gradient(135deg, #c31432 0%, #e74c3c 100%)',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    ]

    const recommendations = ref([
      {
        id: 1,
        type: '文章',
        title: '新中国成立的伟大历程',
        description: '回顾新中国成立以来的辉煌历史',
        cover: 'https://via.placeholder.com/300x200?text=Article+1',
        views: 1250,
        likes: 89
      },
      {
        id: 2,
        type: '视频',
        title: '改革开放四十年',
        description: '见证中国改革开放的伟大成就',
        cover: 'https://via.placeholder.com/300x200?text=Video+1',
        views: 2380,
        likes: 156
      },
      {
        id: 3,
        type: '文章',
        title: '科技强国之路',
        description: '探索中国科技创新的发展历程',
        cover: 'https://via.placeholder.com/300x200?text=Article+2',
        views: 980,
        likes: 72
      },
      {
        id: 4,
        type: '视频',
        title: '人民英雄纪念碑',
        description: '缅怀革命先烈，传承红色精神',
        cover: 'https://via.placeholder.com/300x200?text=Video+2',
        views: 1560,
        likes: 123
      }
    ])

    const hotArticles = ref([
      {
        id: 1,
        title: '抗美援朝战争中的英雄事迹',
        summary: '回顾那段波澜壮阔的历史，致敬最可爱的人',
        cover: 'https://via.placeholder.com/200x150?text=Hot+1',
        category: '历史',
        date: '2025-10-15'
      },
      {
        id: 2,
        title: '航天精神：从东方红到天宫空间站',
        summary: '探索中国航天事业的发展历程和伟大成就',
        cover: 'https://via.placeholder.com/200x150?text=Hot+2',
        category: '科技',
        date: '2025-10-14'
      }
    ])

    const stats = ref([
      { label: '学习用户', value: '10000+', icon: 'UserFilled', color: '#409EFF' },
      { label: '文章数量', value: '5000+', icon: 'Reading', color: '#67C23A' },
      { label: '视频数量', value: '3000+', icon: 'VideoCamera', color: '#E6A23C' },
      { label: '社区话题', value: '8000+', icon: 'ChatDotRound', color: '#F56C6C' }
    ])

    const goToDetail = (item) => {
      if (item.type === '文章') {
        router.push(`/article-detail/${item.id}`)
      } else {
        router.push(`/video-detail/${item.id}`)
      }
    }

    const goToArticle = (id) => {
      router.push(`/article-detail/${id}`)
    }

    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/300x200?text=Image'
    }

    // 获取轮播图数据
    const fetchBanners = async () => {
      try {
        const res = await getBannerList()
        if (res.code === 200 && res.data) {
          // 过滤状态为启用的轮播图，并添加颜色
          banners.value = res.data
            .filter(item => item.status === true)
            .map((item, index) => ({
              ...item,
              color: defaultColors[index % defaultColors.length] // 备用渐变色
            }))
        }
      } catch (error) {
        console.error('获取轮播图失败：', error)
        // 失败时使用默认轮播图
        banners.value = [
          {
            id: 1,
            title: '学习爱国主义精神',
            color: 'linear-gradient(135deg, #c31432 0%, #e74c3c 100%)'
          }
        ]
      }
    }

    // 组件挂载时获取数据
    onMounted(() => {
      fetchBanners()
    })

    return {
      banners,
      recommendations,
      hotArticles,
      stats,
      goToDetail,
      goToArticle,
      handleImageError
    }
  }
}
</script>

<style scoped>
.home {
  padding-bottom: 40px;
}

.banner {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 40px;
}

.banner-item {
  position: relative;
  height: 100%;
  color: white;
  overflow: hidden;
}

/* 轮播图渐变遮罩 */
.banner-item::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  z-index: 1;
}

.banner-title {
  position: absolute;
  bottom: 30px;
  left: 40px;
  right: 40px;
  z-index: 2;
  animation: fadeInUp 0.8s ease-out;
}

.banner-title h2 {
  font-size: 42px;
  font-weight: bold;
  margin: 0;
  color: #fff;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2);
  line-height: 1.3;
  letter-spacing: 1px;
}

/* 添加中国风装饰条 */
.banner-title::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: -15px;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #c31432 0%, #e74c3c 100%);
  border-radius: 2px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 轮播图悬停效果 */
.banner-item:hover .banner-title::before {
  width: 120px;
  transition: width 0.3s ease;
}

.section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.content-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.content-cover {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.content-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.content-card:hover .content-cover img {
  transform: scale(1.1);
}

.content-type {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(195, 20, 50, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.content-info {
  padding: 16px;
}

.content-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.content-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #999;
}

.content-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-item {
  display: flex;
  gap: 16px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.article-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.article-cover {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-content h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
}

.article-content p {
  font-size: 14px;
  color: #666;
  flex: 1;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 13px;
  color: #999;
}

.stats-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.stat-card {
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  transition: all 0.3s;
}

.stat-card:hover {
  background: #f5f5f5;
  transform: translateY(-4px);
}

.stat-card h3 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 12px 0 8px;
}

.stat-card p {
  font-size: 14px;
  color: #666;
}

/* 平板设备适配 */
@media (max-width: 992px) and (min-width: 769px) {
  .banner-title {
    bottom: 25px;
    left: 30px;
    right: 30px;
  }

  .banner-title h2 {
    font-size: 32px;
  }

  .banner-title::before {
    width: 60px;
  }
}

/* 移动设备适配 */
@media (max-width: 768px) {
  .banner-title {
    bottom: 20px;
    left: 20px;
    right: 20px;
  }

  .banner-title h2 {
    font-size: 24px;
    letter-spacing: 0.5px;
  }

  .banner-title::before {
    width: 50px;
    height: 3px;
    bottom: -10px;
  }

  .article-item {
    flex-direction: column;
  }

  .article-cover {
    width: 100%;
  }
}
</style>

