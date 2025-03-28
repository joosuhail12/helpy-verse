
import { useState, useEffect, useCallback } from 'react';
import sessionManager from '@/utils/auth/sessionManager';
import { SessionEvents } from '@/utils/auth/sessionManager';

export const useSessionManager = () => {
  const [isActive, setIsActive] = useState<boolean>(sessionManager.isSessionActive());
  const [timeRemaining, setTimeRemaining] = useState<number>(sessionManager.getSessionTimeRemaining());
  const [showWarning, setShowWarning] = useState<boolean>(sessionManager.isSessionWarningNeeded());
  
  // Create a new session or extend the current one
  const createSession = useCallback((duration?: number) => {
    sessionManager.createSession(duration);
    setIsActive(true);
    setTimeRemaining(sessionManager.getSessionTimeRemaining());
    setShowWarning(false);
  }, []);
  
  // Extend the current session
  const extendSession = useCallback((duration?: number) => {
    sessionManager.extendSession(duration);
    setIsActive(true);
    setTimeRemaining(sessionManager.getSessionTimeRemaining());
    setShowWarning(false);
  }, []);
  
  // End the current session
  const endSession = useCallback(() => {
    sessionManager.endSession();
    setIsActive(false);
    setTimeRemaining(0);
    setShowWarning(false);
  }, []);
  
  // Get CSRF token for the current session
  const getCsrfToken = useCallback(() => {
    return sessionManager.getCsrfToken();
  }, []);
  
  // Listen for session events and update state accordingly
  useEffect(() => {
    // Set initial state
    setIsActive(sessionManager.isSessionActive());
    setTimeRemaining(sessionManager.getSessionTimeRemaining());
    setShowWarning(sessionManager.isSessionWarningNeeded());
    
    // Check session status periodically
    const intervalId = setInterval(() => {
      setIsActive(sessionManager.isSessionActive());
      setTimeRemaining(sessionManager.getSessionTimeRemaining());
      setShowWarning(sessionManager.isSessionWarningNeeded());
    }, 5000); // Check every 5 seconds
    
    // Listen for session events
    const unsubscribeExpired = sessionManager.addEventListener(
      SessionEvents.SESSION_EXPIRED,
      () => {
        setIsActive(false);
        setTimeRemaining(0);
        setShowWarning(false);
      }
    );
    
    const unsubscribeWarning = sessionManager.addEventListener(
      SessionEvents.SESSION_WARNING,
      () => {
        setShowWarning(true);
      }
    );
    
    const unsubscribeExtended = sessionManager.addEventListener(
      SessionEvents.SESSION_EXTENDED,
      () => {
        setIsActive(true);
        setTimeRemaining(sessionManager.getSessionTimeRemaining());
        setShowWarning(false);
      }
    );
    
    return () => {
      clearInterval(intervalId);
      unsubscribeExpired();
      unsubscribeWarning();
      unsubscribeExtended();
    };
  }, []);
  
  return {
    isActive,
    timeRemaining,
    showWarning,
    createSession,
    extendSession,
    endSession,
    getCsrfToken
  };
};

export default useSessionManager;
