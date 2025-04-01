
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AppQueryProvider from './AppQueryProvider';
import AppErrorBoundary from './AppErrorBoundary';
import CaslProvider from "@/components/CaslProvider";
import AppInitializer from './AppInitializer';
import { ThemeProvider } from '@/context/ThemeContext';
import { WidgetStateProvider } from '@/widgets/chat/context/WidgetStateContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Top-level providers component that wraps the entire application
 * with necessary providers and error boundaries.
 */
const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // Initialize with default theme configuration
  const defaultTheme = {
    colors: {
      primary: '#9b87f5',
      primaryForeground: '#ffffff',
      background: '#ffffff',
      backgroundSecondary: '#f9f9f9',
      foreground: '#1f2937',
      border: '#e5e7eb',
      muted: '#f3f4f6',
      accent: '#f9fafb',
      inputBackground: '#ffffff',
      userMessage: '#9b87f5',
      userMessageText: '#ffffff',
      agentMessage: '#f3f4f6',
      agentMessageText: '#1f2937',
      error: '#ef4444',
      success: '#10b981'
    },
    position: 'right' as 'left' | 'right',
    compact: false,
    labels: {
      welcomeTitle: 'Hello there.',
      welcomeSubtitle: 'How can we help?',
      placeholder: 'Type a message...',
      sendButton: 'Send',
      noMessagesText: "You don't have any conversations yet",
      recentMessagesTitle: "Recent Conversations",
      askQuestionButton: "Ask a question"
    },
    features: {
      typingIndicator: true,
      reactions: true,
      fileAttachments: true,
      readReceipts: true,
    }
  };

  return (
    <AppErrorBoundary>
      <Provider store={store}>
        <ThemeProvider initialTheme={defaultTheme}>
          <WidgetStateProvider>
            <AppQueryProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <CaslProvider>
                  <AppInitializer>
                    {children}
                  </AppInitializer>
                </CaslProvider>
              </TooltipProvider>
            </AppQueryProvider>
          </WidgetStateProvider>
        </ThemeProvider>
      </Provider>
    </AppErrorBoundary>
  );
};

export default AppProviders;
