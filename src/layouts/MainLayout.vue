<template>
  <div class="main-layout">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="navbar-container">
        <div class="navbar-logo">
          <img src="@/assets/logo.png" alt="logo" class="logo-img" @error="handleLogoError" />
          <span class="logo-text">青少年爱国教育平台</span>
        </div>
        
        <nav class="navbar-menu">
          <router-link to="/home" class="nav-item">首页</router-link>
          <router-link to="/article-learning" class="nav-item">文章学习</router-link>
          <router-link to="/video-learning" class="nav-item">视频学习</router-link>
          <router-link to="/integration" class="nav-item">积分积累</router-link>
          <router-link to="/community" class="nav-item">社区交流</router-link>
        </nav>

        <div class="navbar-user">
          <template v-if="userStore.isLogin">
            <el-dropdown @command="handleUserCommand">
              <div class="user-info">
                <el-avatar :src="userStore.getAvatar" :size="36">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <span class="username">{{ userStore.userInfo.username }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                  <el-dropdown-item command="learning">学习信息</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="goToLogin">登录</el-button>
            <el-button @click="goToRegister">注册</el-button>
          </template>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>关于我们</h3>
            <p>致力于为青少年提供优质的爱国主义教育内容</p>
          </div>
          <div class="footer-section">
            <h3>快速链接</h3>
            <ul>
              <li><a href="#/home">首页</a></li>
              <li><a href="#/article-learning">文章学习</a></li>
              <li><a href="#/video-learning">视频学习</a></li>
              <li><a href="#/community">社区交流</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>联系我们</h3>
            <p>邮箱: contact@patriotic-edu.com</p>
            <p>电话: 400-123-4567</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 青少年爱国教育平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

export default {
  name: 'MainLayout',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const goToLogin = () => {
      router.push('/login')
    }

    const goToRegister = () => {
      router.push('/register')
    }

    const handleUserCommand = (command) => {
      switch (command) {
        case 'profile':
          router.push('/profile')
          break
        case 'learning':
          router.push('/learning-info')
          break
        case 'logout':
          userStore.logout()
          router.push('/login')
          break
      }
    }

    const handleLogoError = (e) => {
      e.target.style.display = 'none'
    }

    return {
      userStore,
      goToLogin,
      goToRegister,
      handleUserCommand,
      handleLogoError
    }
  }
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 导航栏样式 - 中国风 */
.navbar {
  background: linear-gradient(135deg, #c8102e 0%, #8b0000 50%, #660000 100%);
  box-shadow: 0 4px 20px rgba(200, 16, 46, 0.3), 0 0 0 2px var(--golden);
  position: sticky;
  top: 0;
  z-index: 1000;
  position: relative;
}

.navbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gold-gradient);
}

.navbar::after {
  content: '龍鳳呈祥';
  position: absolute;
  right: 50%;
  top: 50%;
  transform: translate(50%, -50%);
  font-size: 14px;
  color: var(--golden);
  opacity: 0.2;
  letter-spacing: 100px;
  pointer-events: none;
  white-space: nowrap;
  font-weight: bold;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.logo-text {
  font-size: 22px;
  font-weight: bold;
  color: white;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px var(--golden);
  position: relative;
}

.logo-text::before {
  content: '🐉';
  margin-right: 8px;
  font-size: 24px;
  animation: dragon-glow 2s ease-in-out infinite;
}

@keyframes dragon-glow {
  0%, 100% { filter: drop-shadow(0 0 5px gold); }
  50% { filter: drop-shadow(0 0 15px gold); }
}

.navbar-menu {
  display: flex;
  gap: 30px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 17px;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s;
  font-weight: bold;
  letter-spacing: 2px;
  position: relative;
  border: 2px solid transparent;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: var(--gold-gradient);
  transition: width 0.3s;
}

.nav-item:hover {
  background-color: rgba(255, 215, 0, 0.15);
  transform: translateY(-2px);
  border-color: var(--golden);
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.nav-item:hover::after {
  width: 80%;
}

.nav-item.router-link-active {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(212, 175, 55, 0.2) 100%);
  font-weight: bold;
  border-color: var(--golden);
  box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.2);
}

.nav-item.router-link-active::after {
  width: 80%;
}

.navbar-user {
  display: flex;
  gap: 12px;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.username {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px;
}

/* 底部样式 - 中国风 */
.footer {
  background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 50%, #1a1a1a 100%);
  color: white;
  margin-top: auto;
  position: relative;
  border-top: 4px solid var(--golden);
  box-shadow: 0 -4px 20px rgba(212, 175, 55, 0.2);
}

.footer::before {
  content: '龍';
  position: absolute;
  font-size: 200px;
  color: var(--golden);
  opacity: 0.03;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
}

.footer-section h3 {
  font-size: 20px;
  margin-bottom: 16px;
  color: var(--golden);
  letter-spacing: 2px;
  font-weight: bold;
  position: relative;
  padding-bottom: 8px;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: var(--gold-gradient);
}

.footer-section p {
  margin: 8px 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin: 8px 0;
}

.footer-section ul li a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: var(--golden);
  transform: translateX(5px);
  display: inline-block;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 2px solid var(--golden);
  background: linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.05));
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 0;
  letter-spacing: 1px;
}

.footer-bottom p::before {
  content: '🐉 ';
}

.footer-bottom p::after {
  content: ' 🐉';
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-container {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 20px;
  }

  .navbar-menu {
    width: 100%;
    justify-content: flex-start;
    gap: 10px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  .nav-item {
    font-size: 14px;
    padding: 6px 12px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>

