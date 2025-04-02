
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-purple-900">
          Unified Customer Service Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Streamline your customer experience with our all-in-one platform for customer support and engagement.
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
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3 text-purple-800">Unified Inbox</h2>
          <p className="text-gray-600">Manage all customer communications in one place, across all channels.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3 text-purple-800">AI Automation</h2>
          <p className="text-gray-600">Leverage AI to automate routine tasks and provide faster customer service.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3 text-purple-800">Advanced Analytics</h2>
          <p className="text-gray-600">Gain insights into customer behavior and support team performance.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
