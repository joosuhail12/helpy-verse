
import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { sessionManager, SessionEvents } from '@/utils/auth/sessionManager';
import { useThemeContext } from '@/context/ThemeContext';

interface SessionTimeoutAlertProps {
  onExtend: () => void;
  onLogout: () => void;
}

const SessionTimeoutAlert: React.FC<SessionTimeoutAlertProps> = ({ 
  onExtend, 
  onLogout 
}) => {
  const [visible, setVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { colors } = useThemeContext();
  
  // Format remaining time in minutes and seconds
  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle session events
  const handleSessionEvent = (event: SessionEvents, remaining?: number) => {
    if (event === SessionEvents.SESSION_WARNING && remaining) {
      setTimeRemaining(remaining);
      setVisible(true);
    } else if (event === SessionEvents.SESSION_EXPIRED) {
      onLogout();
    } else if (event === SessionEvents.SESSION_RENEWED) {
      setVisible(false);
    }
  };

  // Add session event listener
  useEffect(() => {
    sessionManager.addEventListener(handleSessionEvent);
    
    // Check immediately if warning is needed
    if (sessionManager.isSessionWarningNeeded()) {
      setTimeRemaining(sessionManager.getSessionTimeRemaining());
      setVisible(true);
    }
    
    // Update countdown every second
    const countdownInterval = setInterval(() => {
      if (visible) {
        const remaining = sessionManager.getSessionTimeRemaining();
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          setVisible(false);
          sessionManager.endSession();
        }
      }
    }, 1000);
    
    return () => {
      sessionManager.removeEventListener(handleSessionEvent);
      clearInterval(countdownInterval);
    };
  }, [visible, onLogout]);

  // Handle stay active button
  const handleStayActive = () => {
    sessionManager.extendSession();
    onExtend();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div 
      className="absolute bottom-0 left-0 right-0 p-3 z-50"
      style={{ background: colors.background }}
    >
      <div 
        className="rounded-md p-3 flex flex-col gap-2"
        style={{ 
          background: colors.warningBackground || '#fffbeb',
          borderColor: colors.warningBorder || '#f59e0b',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle 
            size={18} 
            className="shrink-0"
            style={{ color: colors.warning || '#f59e0b' }} 
          />
          <span style={{ color: colors.foreground }}>
            Your session will expire in {formatTimeRemaining(timeRemaining)}
          </span>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onLogout}
            className="px-3 py-1 rounded text-sm"
            style={{ 
              background: 'transparent',
              color: colors.mutedForeground
            }}
          >
            Logout now
          </button>
          <button
            onClick={handleStayActive}
            className="px-3 py-1 rounded text-sm"
            style={{ 
              background: colors.primary,
              color: colors.primaryForeground
            }}
          >
            Stay active
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutAlert;
