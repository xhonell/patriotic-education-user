import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        // 开发环境代理配置
        '/api': {
          target: env.VITE_API_TARGET_URL || 'https://gateway.xhongwong.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            console.log('🔗 开发环境代理目标:', options.target)
          }
        }
      }
    },
    build: {
      // 生产环境构建配置
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      // 消除打包大小超过警告
      chunkSizeWarningLimit: 2000
    }
  }
})

