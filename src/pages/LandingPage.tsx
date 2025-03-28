
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  // Initialize the chat widget when component mounts
  useEffect(() => {
    // Load the chat widget script
    const loadChatWidget = () => {
      // Skip if already initialized
      if (document.getElementById('pullse-chat-widget')) return;
      
      const script = document.createElement('script');
      script.id = 'pullse-chat-widget-script';
      script.src = '/chat-widget.js';
      script.async = true;
      script.defer = true;
      
      // Add configuration for the widget
      window.PULLSE_WORKSPACE_ID = '6c22b22f-7bdf-43db-b7c1-9c5884125c63';
      window.PULLSE_THEME_COLORS = {
        primary: '#6366f1',
        background: '#ffffff',
      };
      
      document.body.appendChild(script);
    };
    
    loadChatWidget();
    
    // Cleanup on component unmount
    return () => {
      const widgetElement = document.getElementById('pullse-chat-widget');
      const scriptElement = document.getElementById('pullse-chat-widget-script');
      
      if (widgetElement) {
        widgetElement.remove();
      }
      
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, []);

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
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700"
            asChild
          >
            <Link to="/sign-in">Sign In</Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            asChild
          >
            <Link to="/sign-up">Create Account</Link>
          </Button>
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

export default LandingPage;
