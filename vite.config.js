import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // We need this built-in node module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Define the @ shortcut that points directly to the src directory
      '@/': path.resolve(__dirname, 'src/'),
    },
  },
  server: {
    fs: {
      cachedChecks: false,
    },
    host: true
  }
})
