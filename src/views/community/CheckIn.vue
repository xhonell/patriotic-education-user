<template>
  <div class="checkin-page">
    <h1 class="page-title">签到打卡</h1>

    <el-row :gutter="20">
      <el-col :xs="24" :lg="16">
        <!-- 签到卡片 -->
        <el-card class="checkin-card">
          <div class="checkin-content">
            <div class="checkin-icon">
              <el-icon :size="80" color="#67C23A"><CircleCheckFilled /></el-icon>
            </div>
            <h2 v-if="!checkedToday" class="checkin-title">今日还未签到</h2>
            <h2 v-else class="checkin-title success">签到成功！</h2>
            <p class="checkin-desc">{{ checkinMessage }}</p>
            <el-button
              type="primary"
              size="large"
              @click="handleCheckIn"
              :disabled="checkedToday"
              :loading="loading"
              class="checkin-button"
            >
              {{ checkedToday ? '今日已签到' : '立即签到' }}
            </el-button>
            <div class="checkin-stats">
              <div class="stat-item">
                <div class="stat-value">{{ checkinData.continuousDays }}</div>
                <div class="stat-label">连续签到</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ checkinData.totalDays }}</div>
                <div class="stat-label">累计签到</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ checkinData.totalPoints }}</div>
                <div class="stat-label">获得积分</div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 签到日历 -->
        <el-card class="calendar-card">
          <template #header>
            <div class="card-header">
              <span>本月签到记录</span>
            </div>
          </template>
          <div class="calendar-container">
            <div class="calendar-grid">
              <div class="calendar-day header" v-for="day in weekDays" :key="day">
                {{ day }}
              </div>
              <div
                v-for="day in calendarDays"
                :key="day.date"
                class="calendar-day"
                :class="{
                  'other-month': !day.currentMonth,
                  'checked': day.checked,
                  'today': day.isToday
                }"
              >
                <span class="day-number">{{ day.day }}</span>
                <span v-if="day.checked" class="check-mark">✓</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <!-- 签到奖励 -->
        <el-card class="rewards-card">
          <template #header>
            <div class="card-header">
              <span>签到奖励</span>
            </div>
          </template>
          <div class="rewards-list">
            <div
              class="reward-item"
              v-for="reward in rewards"
              :key="reward.day"
              :class="{ 'claimed': reward.claimed, 'available': reward.available }"
            >
              <div class="reward-day">第{{ reward.day }}天</div>
              <div class="reward-icon">
                <el-icon :size="32" color="#F56C6C"><TrophyBase /></el-icon>
              </div>
              <div class="reward-points">+{{ reward.points }}积分</div>
              <el-tag v-if="reward.claimed" type="info" size="small">已领取</el-tag>
              <el-tag v-else-if="reward.available" type="success" size="small">可领取</el-tag>
            </div>
          </div>
        </el-card>

        <!-- 签到排行 -->
        <el-card class="ranking-card">
          <template #header>
            <div class="card-header">
              <span>签到排行榜</span>
            </div>
          </template>
          <div class="ranking-list">
            <div class="ranking-item" v-for="(user, index) in topCheckinUsers" :key="user.id">
              <div class="rank-number" :class="'rank-' + (index + 1)">
                {{ index + 1 }}
              </div>
              <el-avatar :src="user.avatar" :size="32">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="user-info">
                <div class="user-name">{{ user.username }}</div>
                <div class="user-days">连续{{ user.days }}天</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'CheckIn',
  setup() {
    const checkedToday = ref(false)
    const loading = ref(false)

    const checkinData = reactive({
      continuousDays: 7,
      totalDays: 45,
      totalPoints: 380
    })

    const weekDays = ['日', '一', '二', '三', '四', '五', '六']

    const calendarDays = reactive([])

    const rewards = reactive([
      { day: 1, points: 5, claimed: true, available: false },
      { day: 2, points: 5, claimed: true, available: false },
      { day: 3, points: 5, claimed: true, available: false },
      { day: 4, points: 5, claimed: true, available: false },
      { day: 5, points: 5, claimed: true, available: false },
      { day: 6, points: 5, claimed: true, available: false },
      { day: 7, points: 50, claimed: false, available: true },
      { day: 14, points: 100, claimed: false, available: false },
      { day: 30, points: 300, claimed: false, available: false }
    ])

    const topCheckinUsers = reactive([
      { id: 1, username: '签到达人', avatar: 'https://via.placeholder.com/100', days: 365 },
      { id: 2, username: '坚持不懈', avatar: 'https://via.placeholder.com/100', days: 280 },
      { id: 3, username: '每日打卡', avatar: 'https://via.placeholder.com/100', days: 210 },
      { id: 4, username: '学习之星', avatar: 'https://via.placeholder.com/100', days: 180 },
      { id: 5, username: '奋斗者', avatar: 'https://via.placeholder.com/100', days: 156 }
    ])

    const checkinMessage = computed(() => {
      if (checkedToday.value) {
        return `恭喜！连续签到${checkinData.continuousDays}天，再接再厉！`
      }
      return `连续签到${checkinData.continuousDays}天，今日还未签到哦~`
    })

    // 生成日历数据
    const generateCalendar = () => {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      const firstDay = new Date(year, month, 1).getDay()
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      
      calendarDays.length = 0
      
      // 上个月的日期
      const prevMonthDays = new Date(year, month, 0).getDate()
      for (let i = firstDay - 1; i >= 0; i--) {
        calendarDays.push({
          day: prevMonthDays - i,
          date: `${year}-${month}-${prevMonthDays - i}`,
          currentMonth: false,
          checked: false,
          isToday: false
        })
      }
      
      // 本月的日期
      const checkedDays = [10, 11, 12, 13, 14, 15, 16] // 模拟已签到的日期
      for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({
          day: i,
          date: `${year}-${month + 1}-${i}`,
          currentMonth: true,
          checked: checkedDays.includes(i),
          isToday: i === today.getDate()
        })
      }
      
      // 下个月的日期（填充到42格）
      const remainingDays = 42 - calendarDays.length
      for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push({
          day: i,
          date: `${year}-${month + 2}-${i}`,
          currentMonth: false,
          checked: false,
          isToday: false
        })
      }
    }

    generateCalendar()

    const handleCheckIn = () => {
      loading.value = true
      
      setTimeout(() => {
        checkedToday.value = true
        checkinData.continuousDays++
        checkinData.totalDays++
        checkinData.totalPoints += 5
        
        // 更新今天的签到状态
        const today = new Date().getDate()
        const todayItem = calendarDays.find(day => day.day === today && day.currentMonth)
        if (todayItem) {
          todayItem.checked = true
        }
        
        loading.value = false
        ElMessage.success('签到成功！获得5积分')
      }, 1000)
    }

    return {
      checkedToday,
      loading,
      checkinData,
      checkinMessage,
      weekDays,
      calendarDays,
      rewards,
      topCheckinUsers,
      handleCheckIn
    }
  }
}
</script>

<style scoped>
.checkin-page {
  max-width: 1400px;
  margin: 0 auto;
}

.checkin-card {
  margin-bottom: 24px;
}

.checkin-content {
  text-align: center;
  padding: 40px 20px;
}

.checkin-icon {
  margin-bottom: 24px;
}

.checkin-title {
  font-size: 32px;
  color: #333;
  margin-bottom: 16px;
}

.checkin-title.success {
  color: #67C23A;
}

.checkin-desc {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}

.checkin-button {
  padding: 16px 48px;
  font-size: 18px;
  margin-bottom: 40px;
}

.checkin-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  padding-top: 32px;
  border-top: 1px solid #eee;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.calendar-card {
  margin-bottom: 24px;
}

.calendar-container {
  padding: 12px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  position: relative;
  background: #f5f7fa;
  transition: all 0.3s;
}

.calendar-day.header {
  background: transparent;
  font-weight: bold;
  color: #333;
  aspect-ratio: auto;
  padding: 8px 0;
}

.calendar-day.other-month {
  opacity: 0.3;
}

.calendar-day.checked {
  background: linear-gradient(135deg, #67C23A, #85CE61);
  color: white;
}

.calendar-day.today {
  border: 2px solid #409EFF;
}

.day-number {
  font-size: 14px;
}

.check-mark {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 12px;
}

.rewards-card {
  margin-bottom: 24px;
}

.rewards-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.reward-item.claimed {
  opacity: 0.6;
}

.reward-item.available {
  background: #f0f9ff;
  border: 2px solid #409EFF;
}

.reward-day {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  min-width: 48px;
}

.reward-icon {
  flex: 1;
}

.reward-points {
  font-size: 16px;
  font-weight: bold;
  color: #F56C6C;
  min-width: 70px;
}

.ranking-card {
  margin-bottom: 24px;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s;
}

.ranking-item:hover {
  background: #f5f7fa;
}

.rank-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px;
  background: #e8eaf0;
  color: #666;
}

.rank-1 {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
}

.rank-2 {
  background: linear-gradient(135deg, #C0C0C0, #808080);
  color: white;
}

.rank-3 {
  background: linear-gradient(135deg, #CD7F32, #8B4513);
  color: white;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.user-days {
  font-size: 12px;
  color: #67C23A;
}

@media (max-width: 768px) {
  .checkin-stats {
    gap: 30px;
  }

  .stat-value {
    font-size: 24px;
  }
}
</style>

