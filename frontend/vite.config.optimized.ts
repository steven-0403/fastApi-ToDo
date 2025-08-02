import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
    }),
  ],
  
  // Development server configuration
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    // Enable HTTP/2 for better performance
    https: false,
    // Faster HMR
    hmr: {
      overlay: false,
    },
  },
  
  // Build optimization
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for production debugging
    sourcemap: false,
    
    // Minification
    minify: 'esbuild', // Faster than terser
    
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
          
          // Component chunks
          'auth-pages': [
            './src/pages/LoginPage.tsx',
            './src/pages/RegisterPage.tsx'
          ],
          'todo-pages': ['./src/pages/TodosPage.tsx'],
          'components': [
            './src/components/Layout.tsx',
            './src/components/TodoForm.tsx',
            './src/components/TodoItem.tsx'
          ],
        },
        
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        
        // Optimize asset names
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop();
          if (extType === 'css') {
            return 'css/[name]-[hash].css';
          }
          return 'assets/[name]-[hash][extname]';
        },
        
        // Entry point naming
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Optimize CSS
    cssCodeSplit: true,
    
    // Report compressed bundle size
    reportCompressedSize: true,
  },
  
  // Dependency optimization
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev server startup
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
    
    // Exclude problematic dependencies
    exclude: ['@vitejs/plugin-react'],
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@services': resolve(__dirname, 'src/services'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
  
  // CSS processing
  css: {
    // CSS modules
    modules: {
      localsConvention: 'camelCase',
    },
    
    // PostCSS configuration
    postcss: {
      plugins: [
        // Tailwind CSS is already in postcss.config.js
      ],
    },
    
    // CSS preprocessing
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  
  // Preview server configuration (for production preview)
  preview: {
    host: '0.0.0.0',
    port: 4173,
    open: false,
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  
  // Experimental features
  experimental: {
    // Enable build time optimizations
    renderBuiltUrl: (filename) => {
      // Use CDN or optimized asset delivery if needed
      return filename;
    },
  },
}); 