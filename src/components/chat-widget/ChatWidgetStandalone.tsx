
import React, { useEffect } from 'react';
import { ChatWidget } from './ChatWidget';
import { ChatProvider } from '@/context/ChatContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { sessionManager } from '@/utils/auth/sessionManager';

// Get configuration from window object or use defaults
const config = (window as any).PULLSE_CHAT_CONFIG || {
  workspaceId: '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
  theme: {
    colors: {},
    position: 'right',
    compact: false,
    labels: {},
    features: {
      typingIndicator: true,
      reactions: true,
      fileAttachments: true,
      readReceipts: true
    },
    // Security settings
    security: {
      requireAuthentication: false,
      endToEndEncryption: false,
      sessionTimeout: 30 // minutes
    }
  }
};

// Get workspace ID and security settings from configuration
const { workspaceId } = config;
const securitySettings = config.theme?.security || {};

// Initialize session with timeout from config
const sessionTimeoutMs = (securitySettings.sessionTimeout || 30) * 60 * 1000;

const ChatWidgetStandalone: React.FC = () => {
  // Initialize session on load
  useEffect(() => {
    sessionManager.initSession(sessionTimeoutMs);
    
    // Set up interval to check session status
    const checkSessionInterval = setInterval(() => {
      if (!sessionManager.isSessionActive()) {
        console.log('Chat session expired');
        // Refresh session to start over
        sessionManager.initSession(sessionTimeoutMs);
      } else {
        sessionManager.updateActivity();
      }
    }, 60000); // Check every minute
    
    return () => {
      clearInterval(checkSessionInterval);
    };
  }, []);
  
  return (
    <ThemeProvider initialTheme={config.theme?.colors}>
      <ChatProvider 
        workspaceId={workspaceId} 
        requiresAuthentication={securitySettings.requireAuthentication}
      >
        <ChatWidget 
          workspaceId={workspaceId}
          theme={{
            position: config.theme?.position,
            compact: config.theme?.compact,
            colors: config.theme?.colors
          }}
        />
      </ChatProvider>
    </ThemeProvider>
  );
};

export default ChatWidgetStandalone;
