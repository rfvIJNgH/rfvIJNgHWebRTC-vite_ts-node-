import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      stream: 'stream-browserify',
      buffer: 'buffer',
      process: 'process/browser',
      events: 'events',
      util: 'util',
    },
  },
  define: {
    global: 'window',
  },
})
