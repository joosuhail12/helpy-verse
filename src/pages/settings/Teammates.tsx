
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import TeammatesPage from './teammates/TeammatesPage';
import { Loader2 } from 'lucide-react';

// Simple loading spinner for nested routes
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

/**
 * Teammates container component that conditionally renders the teammates list
 * or provides an outlet for nested routes
 */
const TeammatesContent = () => {
  const location = useLocation();
  const isListPage = location.pathname === '/home/settings/teammates';
  
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

/**
 * Wrapper component that doesn't use any router hooks directly
 */
const Teammates = () => {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <TeammatesContent />
    </React.Suspense>
  );
};

export default Teammates;
