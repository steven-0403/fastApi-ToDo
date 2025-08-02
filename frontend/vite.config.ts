import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    host: '0.0.0.0',
    port: 3001,
    open: false,
  },
  
  // Build optimizations
  build: {
    // Use esbuild for faster builds
    minify: 'esbuild',
    
    // Target modern browsers for smaller bundles
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
    
    // Optimize CSS
    cssCodeSplit: true,
    
    // Report compressed bundle size
    reportCompressedSize: true,
  },
  
  // Dependency optimization for faster dev server startup
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'zustand',
      'react-hook-form',
      'zod',
      '@hookform/resolvers/zod',
      'react-hot-toast',
      'lucide-react',
    ],
  },
}) 