<template>
  <div class="register-page">
    <!-- 背景装饰 -->
    <div class="dragon-bg-left">🐉</div>
    <div class="dragon-bg-right">🐉</div>
    <div class="phoenix-decoration phoenix-1">🦜</div>
    <div class="phoenix-decoration phoenix-2">🦜</div>
    
    <div class="register-wrapper">
      <!-- 左侧宣传卡片 -->
      <div class="promo-card">
        <div class="promo-content">
          <div class="promo-icons">
            <span class="icon-dragon">🐉</span>
            <span class="icon-phoenix">🦜</span>
          </div>
          <h1 class="promo-title">立即加入我们</h1>
          <p class="promo-subtitle">龍鳳呈祥 · 共筑未来</p>
          <div class="promo-divider"></div>
          
          <div class="promo-stats">
            <div class="stat-item">
              <div class="stat-number">10000+</div>
              <div class="stat-label">注册用户</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">5000+</div>
              <div class="stat-label">学习内容</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50000+</div>
              <div class="stat-label">互动交流</div>
            </div>
          </div>

          <div class="promo-benefits">
            <h3 class="benefits-title">注册即享</h3>
            <div class="benefit-list">
              <div class="benefit-item">
                <span class="benefit-icon">✨</span>
                <span class="benefit-text">新人专属大礼包</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🎁</span>
                <span class="benefit-text">100积分奖励</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🏅</span>
                <span class="benefit-text">解锁全部学习内容</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🌟</span>
                <span class="benefit-text">个性化学习推荐</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">💬</span>
                <span class="benefit-text">加入学习社区</span>
              </div>
            </div>
          </div>

          <div class="promo-footer">
            <div class="promo-decoration">🏮</div>
            <p>让爱国主义精神在心中扎根</p>
          </div>
        </div>
      </div>

      <!-- 右侧注册卡片 -->
      <div class="register-container">
      <!-- 顶部装饰 -->
      <div class="top-decoration">
        <div class="decoration-line"></div>
        <div class="decoration-lantern">🏮</div>
        <div class="decoration-line"></div>
      </div>

      <div class="register-header">
        <div class="icon-group">
          <span class="dragon-icon">🐉</span>
          <span class="phoenix-icon">🦜</span>
        </div>
        <h2>用户注册</h2>
        <p class="subtitle">龍鳳呈祥 · 共筑未来</p>
        <div class="header-decoration"></div>
      </div>

      <el-form :model="registerForm" :rules="rules" ref="registerFormRef" class="register-form">
        <el-form-item prop="username">
          <div class="input-label">
            <el-icon><User /></el-icon>
            用户名
          </div>
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名（3-20位）"
            size="large"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item prop="email">
          <div class="input-label">
            <el-icon><Message /></el-icon>
            邮箱
          </div>
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱地址"
            size="large"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item prop="phone">
          <div class="input-label">
            <el-icon><Iphone /></el-icon>
            手机号
          </div>
          <el-input
            v-model="registerForm.phone"
            placeholder="请输入手机号码"
            size="large"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item prop="code">
          <div class="input-label">
            <el-icon><ChatLineSquare /></el-icon>
            验证码
          </div>
          <div class="code-input-group">
            <el-input
              v-model="registerForm.code"
              placeholder="请输入验证码"
              size="large"
              class="custom-input code-input"
            />
            <el-button 
              size="large" 
              :disabled="countdown > 0" 
              @click="sendCode"
              class="code-button"
            >
              {{ countdown > 0 ? `${countdown}秒` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item prop="password">
          <div class="input-label">
            <el-icon><Lock /></el-icon>
            密码
          </div>
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码（6-20位）"
            size="large"
            show-password
            class="custom-input"
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <div class="input-label">
            <el-icon><Lock /></el-icon>
            确认密码
          </div>
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次确认密码"
            size="large"
            show-password
            class="custom-input"
          />
        </el-form-item>

        <el-form-item class="agree-item">
          <el-checkbox v-model="registerForm.agree" class="custom-checkbox">
            <span class="agree-text">
              我已阅读并同意
              <el-link type="primary" :underline="false" class="policy-link">《用户协议》</el-link>
              和
              <el-link type="primary" :underline="false" class="policy-link">《隐私政策》</el-link>
            </span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            class="register-button" 
            @click="handleRegister" 
            :loading="loading"
          >
            <span v-if="!loading">立即注册</span>
            <span v-else>注册中...</span>
          </el-button>
        </el-form-item>

        <el-form-item class="no-margin">
          <div class="login-link">
            <span class="link-text">已有账号？</span>
            <el-link type="primary" @click="goToLogin" class="login-btn">立即登录</el-link>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const registerFormRef = ref(null)
    const loading = ref(false)
    const countdown = ref(0)

    const registerForm = reactive({
      username: '',
      email: '',
      phone: '',
      code: '',
      password: '',
      confirmPassword: '',
      agree: false
    })

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== registerForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }

    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, validator: validatePass, trigger: 'blur' }
      ]
    }

    const sendCode = () => {
      if (!registerForm.phone) {
        ElMessage.warning('请先输入手机号')
        return
      }

      if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
        ElMessage.warning('请输入正确的手机号')
        return
      }

      // 模拟发送验证码
      ElMessage.success('验证码已发送')
      countdown.value = 60
      
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }

    const handleRegister = async () => {
      if (!registerForm.agree) {
        ElMessage.warning('请阅读并同意用户协议和隐私政策')
        return
      }

      if (!registerFormRef.value) return
      
      await registerFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          
          // 模拟注册API调用
          setTimeout(() => {
            ElMessage.success('注册成功！请登录')
            loading.value = false
            router.push('/login')
          }, 1000)
        }
      })
    }

    const goToLogin = () => {
      router.push('/login')
    }

    return {
      registerForm,
      rules,
      registerFormRef,
      loading,
      countdown,
      sendCode,
      handleRegister,
      goToLogin
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #c8102e 0%, #8b0000 50%, #660000 100%);
  padding: 30px 0;
  position: relative;
  overflow: hidden;
}

/* 背景龙凤装饰 */
.dragon-bg-left,
.dragon-bg-right {
  position: absolute;
  font-size: 280px;
  opacity: 0.04;
  color: var(--golden);
  animation: dragon-float 10s ease-in-out infinite;
  pointer-events: none;
}

.dragon-bg-left {
  left: -80px;
  top: 5%;
  animation-delay: 0s;
}

.dragon-bg-right {
  right: -80px;
  bottom: 5%;
  transform: scaleX(-1);
  animation-delay: 5s;
}

.phoenix-decoration {
  position: absolute;
  font-size: 100px;
  opacity: 0.08;
  color: var(--golden-yellow);
  animation: phoenix-fly 15s linear infinite;
  pointer-events: none;
}

.phoenix-1 {
  top: 20%;
  left: -100px;
  animation-duration: 20s;
}

.phoenix-2 {
  top: 60%;
  left: -100px;
  animation-duration: 25s;
  animation-delay: 8s;
}

@keyframes dragon-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-40px) rotate(8deg);
  }
}

@keyframes phoenix-fly {
  from {
    transform: translateX(0) translateY(0);
  }
  to {
    transform: translateX(calc(100vw + 100px)) translateY(-50px);
  }
}

/* 容器包装 */
.register-wrapper {
  display: flex;
  gap: 30px;
  max-width: 1300px;
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
  border-radius: 28px;
  padding: 50px 40px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35), 0 0 0 4px var(--golden);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.promo-card::before {
  content: '龍鳳';
  position: absolute;
  font-size: 280px;
  color: var(--golden);
  opacity: 0.04;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-10deg);
  font-weight: bold;
  letter-spacing: 30px;
}

.promo-content {
  position: relative;
  z-index: 1;
}

.promo-icons {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
}

.icon-dragon,
.icon-phoenix {
  font-size: 70px;
  animation: icon-bounce 3s ease-in-out infinite;
}

.icon-dragon {
  animation-delay: 0s;
  filter: drop-shadow(0 0 20px gold);
}

.icon-phoenix {
  animation-delay: 1.5s;
  filter: drop-shadow(0 0 20px #ff6b6b);
}

@keyframes icon-bounce {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(-15px) rotate(10deg) scale(1.1);
  }
}

.promo-title {
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  background: var(--red-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 5px;
  margin-bottom: 15px;
}

.promo-subtitle {
  font-size: 18px;
  text-align: center;
  color: var(--dark-gold);
  font-weight: bold;
  letter-spacing: 4px;
  margin-bottom: 30px;
}

.promo-divider {
  width: 150px;
  height: 4px;
  background: var(--gold-gradient);
  margin: 0 auto 40px;
  border-radius: 2px;
}

.promo-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 235, 238, 0.6) 0%, rgba(255, 245, 230, 0.6) 100%);
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.stat-item:hover {
  border-color: var(--golden);
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-red);
  margin-bottom: 8px;
  background: var(--red-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 13px;
  color: #666;
  letter-spacing: 1px;
}

.promo-benefits {
  margin-bottom: 40px;
}

.benefits-title {
  font-size: 22px;
  color: var(--primary-red);
  font-weight: bold;
  text-align: center;
  margin-bottom: 25px;
  letter-spacing: 3px;
}

.benefit-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: white;
  border-radius: 12px;
  border: 2px solid #f0f0f0;
  transition: all 0.3s;
}

.benefit-item:hover {
  border-color: var(--golden);
  transform: translateX(10px);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
}

.benefit-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.benefit-text {
  font-size: 15px;
  color: #333;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.promo-footer {
  text-align: center;
  padding-top: 30px;
  border-top: 3px solid var(--golden);
}

.promo-decoration {
  font-size: 45px;
  margin-bottom: 15px;
  animation: lantern-swing 4s ease-in-out infinite;
  display: inline-block;
  transform-origin: top center;
}

@keyframes lantern-swing {
  0%, 100% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

.promo-footer p {
  font-size: 16px;
  color: var(--primary-red);
  font-weight: bold;
  letter-spacing: 2px;
}

/* 右侧注册容器 */
.register-container {
  flex: 0 0 500px;
  background: white;
  border-radius: 28px;
  padding: 45px 40px;
  box-shadow: 
    0 25px 70px rgba(0, 0, 0, 0.35),
    0 0 0 4px var(--golden),
    inset 0 0 30px rgba(255, 215, 0, 0.05);
  position: relative;
}

@keyframes container-appear {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
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
  gap: 20px;
}

.decoration-line {
  flex: 1;
  height: 3px;
  background: var(--gold-gradient);
  border-radius: 2px;
}

.decoration-lantern {
  font-size: 36px;
  animation: lantern-swing 4s ease-in-out infinite;
  transform-origin: top center;
}

@keyframes lantern-swing {
  0%, 100% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

/* 头部样式 */
.register-header {
  text-align: center;
  margin-bottom: 35px;
  position: relative;
}

.icon-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 18px;
}

.dragon-icon,
.phoenix-icon {
  font-size: 56px;
  animation: icon-float 3s ease-in-out infinite;
  display: inline-block;
}

.dragon-icon {
  animation-delay: 0s;
  filter: drop-shadow(0 0 15px gold);
}

.phoenix-icon {
  animation-delay: 1.5s;
  filter: drop-shadow(0 0 15px #ff6b6b);
}

@keyframes icon-float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.1);
  }
}

.register-header h2 {
  font-size: 38px;
  font-weight: bold;
  color: var(--primary-red);
  margin-bottom: 12px;
  letter-spacing: 8px;
  background: var(--red-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 16px;
  color: var(--dark-gold);
  letter-spacing: 5px;
  font-weight: bold;
  margin-bottom: 20px;
}

.header-decoration {
  width: 120px;
  height: 4px;
  background: var(--gold-gradient);
  margin: 20px auto 0;
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
}

/* 表单样式 */
.register-form {
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

.custom-input :deep(.el-input__wrapper) {
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  padding: 13px 18px;
  box-shadow: 0 4px 12px rgba(200, 16, 46, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-input :deep(.el-input__wrapper):hover {
  border-color: var(--golden);
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.25);
  transform: translateY(-1px);
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-red);
  box-shadow: 0 4px 20px rgba(200, 16, 46, 0.25);
}

/* 验证码输入 */
.code-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.code-input {
  flex: 1;
}

.code-button {
  min-width: 130px;
  height: 50px !important;
  font-weight: bold;
  letter-spacing: 1px;
  border: 2px solid var(--golden);
  color: var(--primary-red);
  background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%);
  border-radius: 12px;
  transition: all 0.3s;
  padding: 0 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-button :deep(.el-button) {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-button:hover:not(:disabled) {
  background: var(--gold-gradient);
  color: var(--deep-red);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.code-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 同意条款 */
.agree-item {
  margin: 20px 0 15px;
}

.agree-text {
  font-size: 13px;
  color: #666;
  letter-spacing: 0.5px;
}

.policy-link {
  font-weight: bold;
  font-size: 13px;
}

.policy-link:hover {
  color: var(--golden) !important;
}

/* 注册按钮 */
.register-button {
  width: 100%;
  height: 54px;
  font-size: 19px;
  font-weight: bold;
  letter-spacing: 8px;
  border-radius: 14px;
  background: var(--red-gradient);
  border: 3px solid var(--golden);
  box-shadow: 0 8px 25px rgba(200, 16, 46, 0.45);
  position: relative;
  overflow: hidden;
  margin-top: 15px;
}

.register-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent);
  transition: left 0.7s;
}

.register-button:hover::before {
  left: 100%;
}

.register-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(200, 16, 46, 0.55);
  border-color: var(--golden-yellow);
}

.register-button:active {
  transform: translateY(-2px);
}

/* 登录链接 */
.no-margin {
  margin-bottom: 0;
}

.login-link {
  text-align: center;
  width: 100%;
  padding: 22px 0 0;
  border-top: 2px solid #f5f5f5;
  margin-top: 15px;
}

.link-text {
  font-size: 15px;
  color: #666;
  letter-spacing: 1px;
}

.login-btn {
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 2px;
  margin-left: 10px;
}

.login-btn:hover {
  color: var(--golden) !important;
}

/* 底部装饰 */
.bottom-decoration {
  margin-top: 25px;
  text-align: center;
  padding-top: 20px;
  border-top: 2px solid #f5f5f5;
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
@media (max-width: 1200px) {
  .register-wrapper {
    flex-direction: column;
    width: 95%;
    max-width: 650px;
  }

  .promo-card {
    padding: 40px 35px;
  }

  .promo-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }

  .stat-item {
    padding: 15px;
  }

  .stat-number {
    font-size: 24px;
  }

  .register-container {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .register-wrapper {
    width: 92%;
    gap: 20px;
  }

  .promo-card {
    padding: 35px 25px;
  }

  .promo-icons {
    gap: 20px;
  }

  .icon-dragon,
  .icon-phoenix {
    font-size: 55px;
  }

  .promo-title {
    font-size: 32px;
    letter-spacing: 3px;
  }

  .promo-subtitle {
    font-size: 15px;
    letter-spacing: 2px;
  }

  .promo-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .stat-item {
    padding: 15px;
  }

  .stat-number {
    font-size: 22px;
  }

  .benefits-title {
    font-size: 19px;
  }

  .benefit-item {
    padding: 12px 15px;
    gap: 12px;
  }

  .benefit-icon {
    font-size: 20px;
  }

  .benefit-text {
    font-size: 14px;
  }

  .register-container {
    padding: 40px 28px;
  }

  .register-header h2 {
    font-size: 30px;
    letter-spacing: 5px;
  }

  .icon-group {
    gap: 15px;
  }

  .dragon-icon,
  .phoenix-icon {
    font-size: 44px;
  }

  .subtitle {
    font-size: 14px;
    letter-spacing: 3px;
  }

  .code-button {
    min-width: 110px;
    font-size: 13px;
  }

  .dragon-bg-left,
  .dragon-bg-right {
    font-size: 180px;
  }

  .promo-card::before {
    font-size: 200px;
  }
}
</style>

