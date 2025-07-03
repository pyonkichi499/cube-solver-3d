import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/cube-solver-3d/' : '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    // プロキシ設定は開発時のみ有効
    ...(process.env.NODE_ENV !== 'production' && {
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://backend:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    })
  }
})
