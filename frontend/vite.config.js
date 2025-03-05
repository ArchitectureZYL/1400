import {
  fileURLToPath,
  URL
} from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src',
        import.meta.url))
    },
  },
  server: {
    proxy: {
      // 以 /api 开头的请求将被代理到后端地址
      '/api': {
        target: 'http://localhost:3000', // 后端接口地址
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径，去除 /api 前缀
      },
    },
  },
})