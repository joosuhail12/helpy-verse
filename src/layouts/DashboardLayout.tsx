
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import Sidebar from '@/components/dashboard/Sidebar';

const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="text-center">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">Please try refreshing the page</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default DashboardLayout;
