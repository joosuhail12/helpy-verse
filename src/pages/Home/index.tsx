
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';

const Home = () => {
  const location = useLocation();
  
  return (
    <div className="container mx-auto p-4">
      <RouteErrorBoundary>
        <Outlet />
      </RouteErrorBoundary>
    </div>
  );
};

export default Home;
