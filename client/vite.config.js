import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // allows other devices on same network to open the app
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})