
import { useState, useEffect, useCallback } from 'react';
import { sessionManager, SessionEvents } from '@/utils/auth/sessionManager';

/**
 * Hook for managing session state and timeouts
 */
export const useSessionManager = (autoRenew: boolean = true) => {
  const [isSessionActive, setIsSessionActive] = useState(sessionManager.isSessionActive());
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(sessionManager.getSessionTimeRemaining());
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  
  // Handle session extension
  const extendSession = useCallback(() => {
    sessionManager.extendSession();
    setIsSessionActive(true);
    setShowTimeoutWarning(false);
    setSessionTimeRemaining(sessionManager.getSessionTimeRemaining());
  }, []);
  
  // End the current session
  const endSession = useCallback(() => {
    sessionManager.endSession();
    setIsSessionActive(false);
    setShowTimeoutWarning(false);
  }, []);
  
  // Initialize a new session
  const initSession = useCallback(() => {
    const sessionId = sessionManager.initSession();
    setIsSessionActive(true);
    setShowTimeoutWarning(false);
    setSessionTimeRemaining(sessionManager.getSessionTimeRemaining());
    return sessionId;
  }, []);
  
  // Format remaining time as MM:SS
  const formatTimeRemaining = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);
  
  // Update activity without extending session
  const updateActivity = useCallback(() => {
    sessionManager.updateActivity();
  }, []);
  
  // Get the CSRF token
  const getCsrfToken = useCallback(() => {
    return sessionManager.getCsrfToken();
  }, []);
  
  // Session event handler
  const handleSessionEvent = useCallback((event: SessionEvents, timeRemaining?: number) => {
    switch (event) {
      case SessionEvents.SESSION_WARNING:
        setShowTimeoutWarning(true);
        if (timeRemaining) {
          setSessionTimeRemaining(timeRemaining);
        }
        break;
        
      case SessionEvents.SESSION_EXPIRED:
        setIsSessionActive(false);
        setShowTimeoutWarning(false);
        break;
        
      case SessionEvents.SESSION_RENEWED:
        setIsSessionActive(true);
        setShowTimeoutWarning(false);
        if (timeRemaining) {
          setSessionTimeRemaining(timeRemaining);
        }
        break;
    }
  }, []);
  
  useEffect(() => {
    // Add event listener for session events
    sessionManager.addEventListener(handleSessionEvent);
    
    // Check session status immediately
    setIsSessionActive(sessionManager.isSessionActive());
    setSessionTimeRemaining(sessionManager.getSessionTimeRemaining());
    setShowTimeoutWarning(sessionManager.isSessionWarningNeeded());
    
    // Set up interval to check and update remaining time
    const checkInterval = setInterval(() => {
      const timeRemaining = sessionManager.getSessionTimeRemaining();
      setSessionTimeRemaining(timeRemaining);
      setIsSessionActive(timeRemaining > 0);
      
      // Auto-renew session if enabled and user is active
      if (autoRenew && timeRemaining > 0 && timeRemaining < 5 * 60 * 1000) {
        // Only auto-renew if the user has been active in the last 5 minutes
        const session = sessionManager.getSession();
        if (session && (Date.now() - session.lastActivity) < 5 * 60 * 1000) {
          extendSession();
        }
      }
    }, 10000); // Check every 10 seconds
    
    return () => {
      // Clean up
      sessionManager.removeEventListener(handleSessionEvent);
      clearInterval(checkInterval);
    };
  }, [handleSessionEvent, extendSession, autoRenew]);
  
  return {
    isSessionActive,
    sessionTimeRemaining,
    showTimeoutWarning,
    extendSession,
    endSession,
    initSession,
    formatTimeRemaining,
    updateActivity,
    getCsrfToken
  };
};
