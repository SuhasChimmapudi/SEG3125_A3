import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    // Add this to support Vercel's routing fallback
    fs: { allow: ['.'] }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
