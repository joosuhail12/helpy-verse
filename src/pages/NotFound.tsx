
import React from 'react';
import { useNavigate, useLocation, NavigateFunction } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const NotFound = () => {
  // Create a safe version of navigate and location that works even outside Router context
  let navigate: NavigateFunction | null = null;
  let pathname = "";
  
  try {
    navigate = useNavigate();
    pathname = useLocation().pathname;
  } catch (error) {
    console.log("Router context not available, navigation will use window.location");
  }

  const handleGoHome = () => {
    if (navigate) {
      navigate('/');
    } else {
      window.location.href = '/';
    }
  };

  const handleGoBack = () => {
    if (navigate) {
      navigate(-1);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
        <p className="text-gray-600">
          Sorry, we couldn't find the page you're looking for.
          {pathname && <span className="block mt-2">Path: {pathname}</span>}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button variant="outline" onClick={handleGoBack}>
            Go Back
          </Button>
          <Button onClick={handleGoHome}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
