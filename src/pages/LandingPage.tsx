
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/context/ThemeContext';

const LandingPage = () => {
  const themeConfig = {
    colors: {
      primary: '#4F46E5',
      primaryForeground: '#FFFFFF',
      background: '#FFFFFF',
      backgroundSecondary: '#F9FAFB',
      foreground: '#111827',
      border: '#E5E7EB',
      userMessage: '#4F46E5',
      userMessageText: '#FFFFFF',
      agentMessage: '#F3F4F6',
      agentMessageText: '#111827',
      inputBackground: '#F9FAFB',
      muted: '#F3F4F6',
      mutedForeground: '#6B7280',
      secondary: '#F3F4F6',
      secondaryForeground: '#111827',
      outgoingMessage: '#4F46E5',
      outgoingMessageForeground: '#FFFFFF',
      incomingMessage: '#F3F4F6',
      incomingMessageForeground: '#111827',
      primaryDark: '#3730A3' // Add the required property
    },
    position: 'right',
    compact: false,
    labels: {
      welcomeTitle: 'Hello there.',
      welcomeSubtitle: 'How can we help?',
      askQuestionButton: 'Ask a question',
      recentMessagesTitle: 'Recent messages',
      noMessagesText: 'No messages yet. Start a conversation!',
      messagePlaceholder: 'Type a message...',
      chatTitle: 'Conversation' // Add the required property
    }
  };

  return (
    <ThemeProvider initialTheme={themeConfig}>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
        <header className="container mx-auto px-4 py-8 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
            <span className="ml-2 text-xl font-bold text-gray-900">Pullse</span>
          </div>
          <div>
            <Button asChild variant="outline" className="mr-2">
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-12 md:py-24 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Modern Customer Support Platform
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                Transform your customer support with Pullse's AI-powered tools. 
                Handle conversations across channels seamlessly and deliver exceptional 
                customer experiences.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link to="/sign-up">Get Started for Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/sign-in">Book a Demo</Link>
                </Button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <img 
                src="/placeholder.svg" 
                alt="Platform preview" 
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default LandingPage;
