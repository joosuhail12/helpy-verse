
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  console.log("Current location in Teammates container:", location.pathname);
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

export default Teammates;
