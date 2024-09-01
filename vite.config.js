import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import config from './config.json'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
      output: {
        comments: false,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/app': {
        target: config.appTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/app/, ''),
      },
      '/back': {
        target: config.backTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/back/, ''),
      }
    }
  },
})