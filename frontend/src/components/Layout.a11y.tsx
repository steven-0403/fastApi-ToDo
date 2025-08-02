import React from 'react';
import { LogOut, CheckSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutA11y: React.FC<LayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip Links for keyboard navigation */}
      <div className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="fixed top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          className="fixed top-4 left-32 z-50 bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Skip to navigation
        </a>
      </div>

      <header role="banner">
        <nav 
          id="navigation"
          className="bg-white shadow-sm border-b" 
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <CheckSquare 
                  className="h-8 w-8 text-blue-600 mr-2" 
                  aria-hidden="true"
                  role="img"
                />
                <h1 className="text-xl font-bold text-gray-900">
                  Todo App
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600" role="status">
                  <span className="sr-only">Currently signed in as </span>
                  Welcome, {user?.username || 'User'}
                </div>
                
                <button
                  onClick={logout}
                  className="btn btn-secondary flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main 
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        role="main"
        aria-label="Todo application"
      >
        <div className="sr-only" aria-live="polite" id="live-region">
          {/* This will be used for dynamic announcements */}
        </div>
        {children}
      </main>

      <footer role="contentinfo" className="sr-only">
        <p>Todo App - Manage your tasks efficiently</p>
      </footer>
    </div>
  );
};

export default LayoutA11y; 