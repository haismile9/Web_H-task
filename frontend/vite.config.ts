import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development'
  
  return {
    plugins: [react()],
    base: '/',
    server: {
      host: '127.0.0.1',
      port: 5173,
      proxy: {
        '/api': 'http://127.0.0.1:8000',
        '/sanctum': 'http://127.0.0.1:8000',
      },
    },
    build: {
      outDir: isDevelopment ? '../backend/public/build' : 'dist',
      emptyOutDir: true,
      manifest: !isDevelopment,
      rollupOptions: {
        input: './index.html',
        output: {
          manualChunks: undefined,
        }
      },
      // Production optimizations
      minify: 'terser',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      assetsDir: 'assets'
    },
    // Production environment variables
    define: {
      __DEV__: isDevelopment,
    },
  }
})
