<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

export default {
  name: 'App',
  setup() {
    const userStore = useUserStore()

    // 应用启动时从本地存储恢复用户信息
    onMounted(() => {
      userStore.initUserInfo()
    })

    return {}
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
