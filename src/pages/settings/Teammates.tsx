
import React, { Suspense } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import TeammatesPage from './teammates/TeammatesPage';
import { Loader2 } from 'lucide-react';

// Simple loading spinner for nested routes
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

/**
 * Teammates container component that renders the teammates list
 * and provides an outlet for nested routes (like teammate detail)
 */
const Teammates = () => {
  // Safe location handling to prevent errors outside of router context
  let isListPage = true;
  let pathname = "";
  
  try {
    // Try to use the router context, but don't break if it's not available
    const location = useLocation();
    console.log("Current location in Teammates container:", location.pathname);
    pathname = location.pathname;
    isListPage = pathname === '/home/settings/teammates';
  } catch (error) {
    console.log("Router context not available, defaulting to list view");
    // Default to showing the list page if not in router context
    isListPage = true;
  }
  
  return (
    <div>
      {isListPage ? (
        <TeammatesPage />
      ) : (
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      )}
    </div>
  );
};

export default Teammates;
