<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="dragon-bg-left">🐉</div>
    <div class="dragon-bg-right">🐉</div>
    <div class="cloud-decoration cloud-1">☁</div>
    <div class="cloud-decoration cloud-2">☁</div>
    <div class="cloud-decoration cloud-3">☁</div>
    
    <div class="login-wrapper">
      <!-- 左侧宣传卡片 -->
      <div class="promo-card">
        <div class="promo-content">
          <div class="promo-icon">🐉</div>
          <h1 class="promo-title">青少年爱国教育平台</h1>
          <p class="promo-subtitle">龙腾华夏 · 爱我中华</p>
          <div class="promo-divider"></div>
          <div class="promo-features">
            <div class="feature-item">
              <div class="feature-icon">📚</div>
              <div class="feature-text">
                <h3>海量学习资源</h3>
                <p>精选爱国主义教育内容</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🎯</div>
              <div class="feature-text">
                <h3>个性化推荐</h3>
                <p>智能推荐适合你的内容</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🏆</div>
              <div class="feature-text">
                <h3>积分奖励系统</h3>
                <p>学习越多收获越多</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">👥</div>
              <div class="feature-text">
                <h3>社区交流互动</h3>
                <p>与同伴分享学习心得</p>
              </div>
            </div>
          </div>
          <div class="promo-footer">
            <div class="promo-decoration">🏮</div>
            <p>传承红色基因 · 培育时代新人</p>
          </div>
        </div>
      </div>

      <!-- 右侧登录卡片 -->
      <div class="login-container">
      <!-- 顶部装饰 -->
      <div class="top-decoration">
        <div class="decoration-line"></div>
        <div class="decoration-knot">🧧</div>
        <div class="decoration-line"></div>
      </div>

      <div class="login-header">
        <div class="dragon-icon">🐉</div>
        <h2>欢迎登录</h2>
        <p class="subtitle">龙腾华夏 · 爱我中华</p>
        <div class="header-decoration"></div>
      </div>

      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form">
        <el-form-item prop="email">
          <div class="input-label">
            <el-icon><Message /></el-icon>
            邮箱
            <span class="label-tip">📧</span>
          </div>
          <el-input
            v-model="loginForm.email"
            placeholder="请输入邮箱地址"
            size="large"
            class="custom-input"
            type="email"
          >
            <template #prefix>
              <el-icon class="input-icon"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <div class="input-label">
            <el-icon><Lock /></el-icon>
            密码
            <span class="label-tip">🔒</span>
          </div>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码（6-20位）"
            size="large"
            show-password
            class="custom-input"
            maxlength="20"
          >
            <template #prefix>
              <el-icon class="input-icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item class="remember-row">
          <div class="remember-section">
            <el-checkbox v-model="loginForm.remember" class="custom-checkbox">
              <span class="checkbox-text">
                记住我
                <span class="checkbox-icon">💾</span>
              </span>
            </el-checkbox>
            <div v-if="loginForm.remember" class="remember-tip">
              下次将自动填充账号密码
            </div>
          </div>
          <div class="forgot-section">
            <el-link type="primary" :underline="false" class="forgot-link">
              <span class="forgot-text">
                忘记密码？
                <span class="forgot-icon">🔑</span>
              </span>
            </el-link>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            class="login-button" 
            @click="handleLogin" 
            :loading="loading"
          >
            <span v-if="!loading">立即登录</span>
            <span v-else>登录中...</span>
          </el-button>
        </el-form-item>

        <el-form-item class="no-margin">
          <div class="register-link">
            <span class="link-text">还没有账号？</span>
            <el-link type="primary" @click="goToRegister" class="register-btn">立即注册</el-link>
          </div>
        </el-form-item>
      </el-form>

      <!-- 底部装饰 -->
      <div class="bottom-decoration">
        <div class="decoration-text">青少年爱国教育平台</div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { login, getUserInfo } from '@/api/user'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const loginFormRef = ref(null)
    const loading = ref(false)

    const loginForm = reactive({
      email: '',
      password: '',
      remember: false
    })

    // 从本地缓存加载保存的登录信息
    const loadRememberedLogin = () => {
      const rememberedEmail = localStorage.getItem('rememberedEmail')
      const rememberedPassword = localStorage.getItem('rememberedPassword')
      const isRemember = localStorage.getItem('isRemember')
      
      if (isRemember === 'true' && rememberedEmail) {
        loginForm.email = rememberedEmail
        loginForm.password = rememberedPassword || ''
        loginForm.remember = true
        
        // 显示欢迎提示
        setTimeout(() => {
          ElMessage.info({
            message: '✨ 已为您自动填充上次登录的账号信息',
            duration: 3000
          })
        }, 500)
        
        console.log('已自动填充上次登录的账号信息')
      }
    }

    // 保存或清除登录信息
    const handleRememberLogin = (remember, email, password) => {
      if (remember) {
        // 保存到本地缓存
        localStorage.setItem('rememberedEmail', email)
        localStorage.setItem('rememberedPassword', password)
        localStorage.setItem('isRemember', 'true')
        console.log('已保存登录信息到本地缓存')
      } else {
        // 清除缓存
        localStorage.removeItem('rememberedEmail')
        localStorage.removeItem('rememberedPassword')
        localStorage.removeItem('isRemember')
        console.log('已清除缓存的登录信息')
      }
    }

    // 组件挂载时加载记住的登录信息
    onMounted(() => {
      loadRememberedLogin()
    })

    const rules = {
      email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' }
      ]
    }

    const handleLogin = async () => {
      if (!loginFormRef.value) return
      
      await loginFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          
          try {
            // 准备登录数据
            const loginData = {
              email: loginForm.email,
              password: loginForm.password
            }
            
            console.log('登录请求数据：', loginData)
            
            // 调用登录API
            const response = await login(loginData)
            
            if (response.code === 200) {
              // 保存token
              const token = response.data
              userStore.token = token
              localStorage.setItem('token', token)
              
              // 处理"记住我"功能
              handleRememberLogin(loginForm.remember, loginForm.email, loginForm.password)
              
              // 获取用户信息
              try {
                const userInfoResponse = await getUserInfo()
                if (userInfoResponse.code === 200) {
                  // 保存用户信息到store
                  userStore.login(userInfoResponse.data, token)
                  
                  ElMessage.success({
                    message: loginForm.remember 
                      ? '🎉 登录成功！已保存登录信息！' 
                      : '🎉 登录成功！欢迎回来！',
                    duration: 2000
                  })
                  
                  // 延迟跳转
                  setTimeout(() => {
                    const redirect = router.currentRoute.value.query.redirect || '/home'
                    router.push(redirect)
                  }, 1000)
                }
              } catch (error) {
                console.error('获取用户信息失败：', error)
                // 即使获取用户信息失败，也保存token
                userStore.token = token
                ElMessage.success('登录成功！')
                
                setTimeout(() => {
                  const redirect = router.currentRoute.value.query.redirect || '/home'
                  router.push(redirect)
                }, 1000)
              }
            } else {
              ElMessage.error(response.message || '登录失败，请检查邮箱和密码')
            }
          } catch (error) {
            console.error('登录失败：', error)
          
          } finally {
            loading.value = false
          }
        }
      })
    }

    const goToRegister = () => {
      router.push('/register')
    }

    return {
      loginForm,
      rules,
      loginFormRef,
      loading,
      handleLogin,
      goToRegister,
      loadRememberedLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #c8102e 0%, #8b0000 50%, #660000 100%);
  position: relative;
  overflow: hidden;
}

/* 背景龙装饰 */
.dragon-bg-left,
.dragon-bg-right {
  position: absolute;
  font-size: 300px;
  opacity: 0.03;
  color: var(--golden);
  animation: dragon-float 8s ease-in-out infinite;
  pointer-events: none;
}

.dragon-bg-left {
  left: -100px;
  top: 10%;
  animation-delay: 0s;
}

.dragon-bg-right {
  right: -100px;
  bottom: 10%;
  transform: scaleX(-1);
  animation-delay: 4s;
}

@keyframes dragon-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(5deg);
  }
}

/* 祥云装饰 */
.cloud-decoration {
  position: absolute;
  font-size: 80px;
  color: rgba(255, 215, 0, 0.1);
  animation: cloud-drift 20s linear infinite;
  pointer-events: none;
}

.cloud-1 {
  top: 15%;
  left: -100px;
  animation-duration: 25s;
}

.cloud-2 {
  top: 45%;
  left: -100px;
  animation-duration: 30s;
  animation-delay: 5s;
}

.cloud-3 {
  top: 75%;
  left: -100px;
  animation-duration: 35s;
  animation-delay: 10s;
}

@keyframes cloud-drift {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(100vw + 100px));
  }
}

/* 容器包装 */
.login-wrapper {
  display: flex;
  gap: 30px;
  max-width: 1200px;
  width: 90%;
  animation: wrapper-appear 0.8s ease-out;
}

@keyframes wrapper-appear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 左侧宣传卡片 */
.promo-card {
  flex: 1;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  border-radius: 24px;
  padding: 50px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 3px var(--golden);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.promo-card::before {
  content: '龍';
  position: absolute;
  font-size: 350px;
  color: var(--golden);
  opacity: 0.05;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-15deg);
  font-weight: bold;
}

.promo-content {
  position: relative;
  z-index: 1;
}

.promo-icon {
  font-size: 80px;
  text-align: center;
  margin-bottom: 20px;
  animation: promo-icon-float 3s ease-in-out infinite;
  filter: drop-shadow(0 0 20px gold);
}

@keyframes promo-icon-float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-15px) scale(1.05);
  }
}

.promo-title {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  background: var(--red-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 4px;
  margin-bottom: 15px;
}

.promo-subtitle {
  font-size: 18px;
  text-align: center;
  color: var(--dark-gold);
  font-weight: bold;
  letter-spacing: 3px;
  margin-bottom: 30px;
}

.promo-divider {
  width: 120px;
  height: 4px;
  background: var(--gold-gradient);
  margin: 0 auto 40px;
  border-radius: 2px;
}

.promo-features {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 235, 238, 0.5) 0%, rgba(255, 245, 230, 0.5) 100%);
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.feature-item:hover {
  border-color: var(--golden);
  transform: translateX(10px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
}

.feature-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.feature-text h3 {
  font-size: 18px;
  color: var(--primary-red);
  margin-bottom: 8px;
  font-weight: bold;
  letter-spacing: 1px;
}

.feature-text p {
  font-size: 14px;
  color: #666;
  letter-spacing: 0.5px;
}

.promo-footer {
  text-align: center;
  padding-top: 30px;
  border-top: 2px solid var(--golden);
}

.promo-decoration {
  font-size: 40px;
  margin-bottom: 15px;
  animation: lantern-swing 4s ease-in-out infinite;
  display: inline-block;
  transform-origin: top center;
}

.promo-footer p {
  font-size: 16px;
  color: var(--primary-red);
  font-weight: bold;
  letter-spacing: 2px;
}

/* 右侧登录容器 */
.login-container {
  flex: 0 0 480px;
  background: white;
  border-radius: 24px;
  padding: 50px 45px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 3px var(--golden);
  position: relative;
  backdrop-filter: blur(10px);
}

@keyframes container-appear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 顶部装饰 */
.top-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  gap: 15px;
}

.decoration-line {
  flex: 1;
  height: 2px;
  background: var(--gold-gradient);
}

.decoration-knot {
  font-size: 32px;
  animation: swing 3s ease-in-out infinite;
  transform-origin: top center;
}

@keyframes swing {
  0%, 100% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(8deg);
  }
}

/* 头部样式 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.dragon-icon {
  font-size: 64px;
  margin-bottom: 15px;
  animation: dragon-glow 2s ease-in-out infinite;
  display: inline-block;
}

@keyframes dragon-glow {
  0%, 100% {
    filter: drop-shadow(0 0 10px gold);
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 25px gold);
    transform: scale(1.1);
  }
}

.login-header h2 {
  font-size: 36px;
  font-weight: bold;
  color: var(--primary-red);
  margin-bottom: 12px;
  letter-spacing: 6px;
  background: var(--red-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(200, 16, 46, 0.2);
}

.subtitle {
  font-size: 16px;
  color: var(--dark-gold);
  letter-spacing: 4px;
  font-weight: bold;
  margin-bottom: 20px;
}

.header-decoration {
  width: 100px;
  height: 4px;
  background: var(--gold-gradient);
  margin: 20px auto 0;
  border-radius: 2px;
}

/* 表单样式 */
.login-form {
  margin-top: 30px;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: var(--primary-red);
  font-weight: bold;
  font-size: 15px;
  letter-spacing: 2px;
}

.label-tip {
  margin-left: auto;
  font-size: 14px;
  animation: tip-float 2s ease-in-out infinite;
}

@keyframes tip-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.input-icon {
  color: var(--golden);
  font-size: 16px;
}

.custom-input {
  border-radius: 12px;
}

.custom-input :deep(.el-input__wrapper) {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 14px 18px;
  box-shadow: 0 4px 12px rgba(200, 16, 46, 0.08);
  transition: all 0.3s;
}

.custom-input :deep(.el-input__wrapper):hover {
  border-color: var(--golden);
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.2);
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-red);
  box-shadow: 0 4px 20px rgba(200, 16, 46, 0.2);
}

.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;
  min-height: 24px;
}

.remember-row :deep(.el-form-item__content) {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  flex-wrap: nowrap;
}

.remember-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.forgot-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  padding-top: 2px;
  flex-shrink: 0;
  white-space: nowrap;
}

.custom-checkbox {
  font-weight: 500;
}

.custom-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--primary-red);
  border-color: var(--primary-red);
}

.custom-checkbox :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: var(--primary-red);
}

.checkbox-text {
  color: #666;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.3s;
}

.custom-checkbox:hover .checkbox-text {
  color: var(--primary-red);
}

.checkbox-icon {
  font-size: 14px;
  animation: save-bounce 2s ease-in-out infinite;
}

@keyframes save-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.remember-tip {
  font-size: 11px;
  color: var(--golden);
  padding-left: 24px;
  letter-spacing: 0.5px;
  animation: tip-slide-in 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: 4px;
}

.remember-tip::before {
  content: '✓';
  font-weight: bold;
  color: var(--primary-red);
}

@keyframes tip-slide-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.forgot-link {
  font-weight: bold;
  letter-spacing: 1px;
  transition: all 0.3s;
}

.forgot-text {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--primary-red);
  transition: color 0.3s;
}

.forgot-link:hover .forgot-text {
  color: var(--golden) !important;
}

.forgot-icon {
  font-size: 14px;
  animation: key-rotate 3s ease-in-out infinite;
}

@keyframes key-rotate {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(15deg);
  }
}

/* 登录按钮 */
.login-button {
  width: 100%;
  height: 52px;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 6px;
  border-radius: 12px;
  background: var(--red-gradient);
  border: 3px solid var(--golden);
  box-shadow: 0 6px 20px rgba(200, 16, 46, 0.4);
  position: relative;
  overflow: hidden;
  margin-top: 10px;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), transparent);
  transition: left 0.6s;
}

.login-button:hover::before {
  left: 100%;
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(200, 16, 46, 0.5);
  border-color: var(--golden-yellow);
}

.login-button:active {
  transform: translateY(-1px);
}

/* 注册链接 */
.no-margin {
  margin-bottom: 0;
}

.register-link {
  text-align: center;
  width: 100%;
  padding: 20px 0 0;
  border-top: 2px solid #f0f0f0;
  margin-top: 10px;
}

.link-text {
  font-size: 15px;
  color: #666;
  letter-spacing: 1px;
}

.register-btn {
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 2px;
  margin-left: 8px;
}

.register-btn:hover {
  color: var(--golden) !important;
}

/* 底部装饰 */
.bottom-decoration {
  margin-top: 30px;
  text-align: center;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.decoration-text {
  font-size: 13px;
  color: #999;
  letter-spacing: 2px;
}

.decoration-text::before {
  content: '🐉 ';
}

.decoration-text::after {
  content: ' 🐉';
}

/* 响应式 */
@media (max-width: 1024px) {
  .login-wrapper {
    flex-direction: column;
    width: 95%;
    max-width: 600px;
  }

  .promo-card {
    padding: 40px 30px;
  }

  .promo-title {
    font-size: 32px;
  }

  .promo-features {
    gap: 20px;
  }

  .feature-item {
    padding: 15px;
  }

  .login-container {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .login-wrapper {
    width: 92%;
    gap: 20px;
  }

  .promo-card {
    padding: 35px 25px;
  }

  .promo-icon {
    font-size: 60px;
  }

  .promo-title {
    font-size: 28px;
    letter-spacing: 2px;
  }

  .promo-subtitle {
    font-size: 15px;
    letter-spacing: 2px;
  }

  .feature-item {
    gap: 15px;
  }

  .feature-icon {
    font-size: 30px;
  }

  .feature-text h3 {
    font-size: 16px;
  }

  .feature-text p {
    font-size: 13px;
  }

  .login-container {
    padding: 40px 30px;
  }

  .login-header h2 {
    font-size: 28px;
    letter-spacing: 4px;
  }

  .dragon-icon {
    font-size: 48px;
  }

  .subtitle {
    font-size: 14px;
    letter-spacing: 2px;
  }

  .dragon-bg-left,
  .dragon-bg-right {
    font-size: 200px;
  }

  .promo-card::before {
    font-size: 250px;
  }
}
</style>

