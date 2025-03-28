
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-purple-900">
          Customer Support Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Streamline your customer communications with our all-in-one platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => navigate('/sign-in')}
          >
            Sign In
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/sign-up')}
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
