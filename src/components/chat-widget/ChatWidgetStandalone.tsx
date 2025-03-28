
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { ChatWidget } from './ChatWidget';
import { isOriginAllowed } from '@/utils/security/originValidator';

/**
 * Standalone chat widget component that can be embedded on any website
 */
const ChatWidgetStandalone: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [allowedOrigins, setAllowedOrigins] = useState<string[]>([]);
  const { theme, setTheme } = useTheme();
  
  // Get allowed origins from config
  useEffect(() => {
    const configAllowedOrigins = (window.PULLSE_CHAT_CONFIG?.allowedOrigins || []) as string[];
    setAllowedOrigins(configAllowedOrigins);
  }, []);
  
  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    
    // Set default theme
    if (!theme) setTheme('light');
    
    // Log origin information
    const origin = window.location.origin;
    const hostname = window.location.hostname;
    console.log(`Chat widget running on: ${origin} (${hostname})`);
    
    // Cleanup function
    return () => {
      setMounted(false);
    };
  }, []);

  // Default workspace ID from config or fallback
  const workspaceId = window.PULLSE_CHAT_CONFIG?.workspaceId || '6c22b22f-7bdf-43db-b7c1-9c5884125c63';
  
  if (!mounted) return null;

  return (
    <ChatWidget 
      workspaceId={workspaceId} 
      allowedOrigins={allowedOrigins} 
    />
  );
};

export default ChatWidgetStandalone;
