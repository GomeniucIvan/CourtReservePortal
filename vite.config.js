import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser', 
    terserOptions: {
      compress: {
        drop_console: true,  // Remove consoles
      },
      output: {
        comments: false, // Remove comments
      },
    },
  },
  server: {
    host: '0.0.0.0',
  },
})