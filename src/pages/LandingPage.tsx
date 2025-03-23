
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ChatWidgetStandalone from '@/components/chat-widget/ChatWidgetStandalone';

/**
 * Landing page that is accessible without authentication
 * Serves as an entry point to the application for new users
 */
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Customer Support Made <span className="text-purple-600">Intelligent</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Streamline your customer support with our AI-powered platform. Get insights, automate workflows, and deliver exceptional service.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              onClick={() => navigate('/sign-in')}
            >
              Sign In
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8"
              onClick={() => navigate('/sign-up')}
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-purple-700">Intelligent Inbox</h3>
            <p className="text-gray-600">Prioritize, categorize, and respond to customer inquiries efficiently with AI assistance.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-purple-700">Workflow Automation</h3>
            <p className="text-gray-600">Create smart workflows that automate repetitive tasks and route inquiries to the right team.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-purple-700">Customer Analytics</h3>
            <p className="text-gray-600">Gain valuable insights into customer behavior and support trends with detailed analytics.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-16 bg-white rounded-xl my-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Trusted by Teams Everywhere
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-xl">
            <p className="text-gray-700 italic mb-4">
              "This platform has transformed how we handle customer support. Our response times have decreased by 35% while customer satisfaction is at an all-time high."
            </p>
            <p className="font-semibold text-gray-900">Sarah Johnson, Customer Success Manager</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl">
            <p className="text-gray-700 italic mb-4">
              "The automation capabilities have freed up our support team to focus on complex issues while routine inquiries are handled automatically."
            </p>
            <p className="font-semibold text-gray-900">Michael Chen, Support Operations Director</p>
          </div>
        </div>
      </div>

      {/* Chat widget embedded on the landing page */}
      <ChatWidgetStandalone />

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Ready to Transform Your Customer Support?
        </h2>
        <Button 
          size="lg" 
          className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          onClick={() => navigate('/sign-up')}
        >
          Get Started Today
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>Features</li>
                <li>Pricing</li>
                <li>Use Cases</li>
                <li>Roadmap</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>Documentation</li>
                <li>API</li>
                <li>Community</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Partners</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p>© 2023 Support Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
