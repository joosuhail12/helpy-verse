
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';

const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

/**
 * Main dashboard layout that includes the sidebar and main content area
 * Wraps content in route-level error boundary and suspense fallback
 */
const DashboardLayout = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden relative">
        <RouteErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </RouteErrorBoundary>
      </main>
    </div>
  );
};

export default DashboardLayout;
