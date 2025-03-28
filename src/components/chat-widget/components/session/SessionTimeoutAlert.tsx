
import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useEventSystem } from '@/hooks/useEventSystem';
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface SessionTimeoutAlertProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onRenew?: () => void;
  onTimeout?: () => void;
  isAuthenticated?: boolean;
}

export function SessionTimeoutAlert({
  timeoutMinutes = 30,
  warningMinutes = 5,
  onRenew,
  onTimeout,
  isAuthenticated = false,
}: SessionTimeoutAlertProps) {
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(timeoutMinutes * 60);
  const { emit } = useEventSystem();

  // Reset the timer when there's user activity
  const updateActivity = () => {
    setLastActivity(new Date());
    setShowWarning(false);
  };

  // Handle session renewal
  const handleRenew = () => {
    updateActivity();
    onRenew?.();
    emit('session:renewed', { timestamp: new Date() });
  };

  // Handle session timeout
  const handleTimeout = () => {
    setShowWarning(false);
    onTimeout?.();
    emit('session:timeout', { timestamp: new Date() });
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
        emit('session:warning', { timeRemaining });
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
  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated || !showWarning) {
    return null;
  }

  return (
    <AlertDialog open={showWarning} onOpenChange={(open) => !open && updateActivity()}>
      <AlertDialogContent className="bg-amber-50 border-amber-200">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertDialogTitle>Session timeout warning</AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        
        <div className="py-3">
          <p className="text-sm text-gray-700">
            Your session will expire in <span className="font-bold">{formatTime(remainingTime)}</span> due to inactivity.
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Click 'Continue Session' to stay signed in.
          </p>
        </div>
        
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={handleRenew}
            className="bg-white border-gray-300 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Continue Session
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
