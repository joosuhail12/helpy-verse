
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';

const Index = () => {
  let navigate;
  
  try {
    navigate = useNavigate();
  } catch (error) {
    console.error("Router context not available in Index component");
  }

  // Safe navigation function that works even if useNavigate fails
  const safeNavigate = (path) => {
    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
    }
  };

  let isAuthenticated = false;
  try {
    // Use a try-catch to safely access the Redux store
    const auth = useAppSelector((state) => state.auth);
    isAuthenticated = auth?.isAuthenticated || false;
  } catch (error) {
    console.error("Redux store not available in Index component");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-purple-900">
          Customer Engagement Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage contacts, automate workflows, and provide exceptional customer service with our all-in-one platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => safeNavigate('/home/dashboard')}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => safeNavigate('/auth/login')}
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => safeNavigate('/auth/register')}
              >
                Create Account
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3 text-purple-800">Contact Management</h2>
          <p className="text-gray-600">Organize and manage your customer contacts with powerful filtering and segmentation tools.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3 text-purple-800">Workflow Automation</h2>
          <p className="text-gray-600">Create intelligent workflows to automate repetitive tasks and streamline your processes.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3 text-purple-800">Support Ticketing</h2>
          <p className="text-gray-600">Handle customer inquiries efficiently with our integrated ticketing system.</p>
        </div>
      </div>
      
      <footer className="mt-20 text-center text-gray-500 pb-8">
        <p>© 2023 Customer Engagement Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
