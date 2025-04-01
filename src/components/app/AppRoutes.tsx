
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/index';
import { Loader2 } from 'lucide-react';

const FallbackErrorDisplay = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4">
    <h1 className="text-2xl font-bold text-red-600 mb-4">Router Initialization Error</h1>
    <p className="text-gray-700 mb-4">
      The application encountered an error while initializing the router.
    </p>
    <button 
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Reload Application
    </button>
  </div>
);

/**
 * Component for application routing
 * Uses React Router v6 for handling routes
 */
const AppRoutes: React.FC = () => {
  try {
    console.log('AppRoutes rendering with router:', router);
    
    if (!router) {
      console.error('Router is not properly initialized');
      return <FallbackErrorDisplay />;
    }
    
    return (
      <RouterProvider 
        router={router} 
        fallbackElement={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        }
      />
    );
  } catch (error) {
    console.error('Error rendering router:', error);
    return <FallbackErrorDisplay />;
  }
};

export default AppRoutes;
