
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';

/**
 * Main dashboard layout that includes the sidebar and main content area
 * Wraps content in route-level error boundary and suspense fallback
 */
const DashboardLayout = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto relative">
        <RouteErrorBoundary>
          <Suspense fallback={<LoadingSpinner className="h-full" />}>
            <Outlet />
          </Suspense>
        </RouteErrorBoundary>
      </main>
    </div>
  );
};

export default DashboardLayout;
