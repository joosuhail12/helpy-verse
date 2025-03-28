
import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface SessionTimeoutAlertProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onExtend?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export function SessionTimeoutAlert({
  timeoutMinutes = 30,
  warningMinutes = 5,
  onExtend,
  onLogout,
  isAuthenticated = false,
}: SessionTimeoutAlertProps) {
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(timeoutMinutes * 60);

  // Reset the timer when there's user activity
  const updateActivity = () => {
    setLastActivity(new Date());
    setShowWarning(false);
  };

  // Handle session renewal
  const handleRenew = () => {
    updateActivity();
    onExtend?.();
  };

  // Handle session timeout
  const handleTimeout = () => {
    setShowWarning(false);
    onLogout?.();
  };

  // Set up activity listeners
  useEffect(() => {
    if (!isAuthenticated) return; // Only track session for authenticated users

    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    // Update activity on user interaction
    const handleUserActivity = () => {
      updateActivity();
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Clean up event listeners
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isAuthenticated]);
  
  // Check session timeout
  useEffect(() => {
    if (!isAuthenticated) return; // Only check session for authenticated users
    
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeSinceLastActivity = Math.floor((now.getTime() - lastActivity.getTime()) / 1000);
      const timeRemaining = timeoutMinutes * 60 - timeSinceLastActivity;
      
      setRemainingTime(timeRemaining);
      
      // Show warning when approaching timeout
      if (timeRemaining <= warningMinutes * 60 && !showWarning) {
        setShowWarning(true);
      }
      
      // Handle timeout
      if (timeRemaining <= 0) {
        clearInterval(intervalId);
        handleTimeout();
      }
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, lastActivity, timeoutMinutes, warningMinutes, showWarning]);

  // Format the remaining time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.floor(Math.max(0, seconds) % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showWarning) {
    return null;
  }

  return (
    <AlertDialog open={showWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Session Timeout Warning
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="py-4">
          <p>Your session will expire in <span className="font-bold">{formatTime(remainingTime)}</span>.</p>
          <p className="mt-2">Would you like to extend your session?</p>
        </div>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleTimeout}>
            Logout
          </Button>
          <Button onClick={handleRenew} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Extend Session
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Export as named export and as default for backwards compatibility
export default SessionTimeoutAlert;
