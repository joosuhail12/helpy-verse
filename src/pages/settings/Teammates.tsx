
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
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
  return (
    <div>
      {/* Check if we're on the main teammates route or a nested route */}
      {window.location.pathname === '/home/settings/teammates' ? (
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
