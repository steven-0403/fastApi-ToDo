import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppOptimized from './App.optimized';
import './index.css';

// Optimized QueryClient configuration for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error && typeof error.status === 'number') {
          return error.status >= 500 && failureCount < 2; // Reduced retries
        }
        return failureCount < 2; // Reduced retries for faster error handling
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      // Reduce network waterfall
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Performance monitoring
const startTime = performance.now();

// Preload critical resources
const preloadCriticalResources = () => {
  // Preload critical API endpoints if user is authenticated
  const token = localStorage.getItem('token');
  if (token) {
    // Prefetch user data
    queryClient.prefetchQuery({
      queryKey: ['user'],
      queryFn: async () => {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.json();
      },
      staleTime: 1000 * 60 * 5,
    });
  }
};

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Preload resources after initial render
  setTimeout(preloadCriticalResources, 100);
  
  // Log performance metrics
  window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    console.log(`App loaded in ${loadTime.toFixed(2)}ms`);
    
    // Report Core Web Vitals
    if ('web-vital' in window) {
      // This would be replaced with actual web vitals reporting
      console.log('Web Vitals monitoring ready');
    }
  });
}

// Optimized React rendering
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Use concurrent features for better perceived performance
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppOptimized />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000, // Reduced duration for less distraction
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: '14px',
            },
            success: {
              duration: 2000, // Faster success messages
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000, // Keep error messages longer
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
            // Reduce animation for better performance
            className: 'toast-notification',
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// Progressive enhancement
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // Register service worker for caching in production
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
} 