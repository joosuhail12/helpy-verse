
import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { sessionManager, SessionEvents } from '@/utils/auth/sessionManager';
import { useThemeContext } from '@/context/ThemeContext';

interface SessionTimeoutAlertProps {
  onExtend: () => void;
  onLogout: () => void;
}

type AlertType = 'session' | 'rateLimit';

const SessionTimeoutAlert: React.FC<SessionTimeoutAlertProps> = ({ 
  onExtend, 
  onLogout 
}) => {
  const [visible, setVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [alertType, setAlertType] = useState<AlertType>('session');
  const [rateLimitMessage, setRateLimitMessage] = useState('');
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
      setAlertType('session');
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
      setAlertType('session');
      setVisible(true);
    }
    
    // Update countdown every second
    const countdownInterval = setInterval(() => {
      if (visible && alertType === 'session') {
        const remaining = sessionManager.getSessionTimeRemaining();
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          setVisible(false);
          sessionManager.endSession();
        }
      }
    }, 1000);
    
    // Custom event for rate limit warnings
    const handleRateLimitEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        setRateLimitMessage(event.detail.message);
        setAlertType('rateLimit');
        setVisible(true);
        
        // Auto-hide rate limit warning after displayed time
        if (event.detail.duration) {
          setTimeout(() => {
            if (alertType === 'rateLimit') {
              setVisible(false);
            }
          }, event.detail.duration);
        }
      }
    };
    
    window.addEventListener('rateLimitWarning', handleRateLimitEvent as EventListener);
    
    return () => {
      sessionManager.removeEventListener(handleSessionEvent);
      window.removeEventListener('rateLimitWarning', handleRateLimitEvent as EventListener);
      clearInterval(countdownInterval);
    };
  }, [visible, onLogout, alertType]);

  // Handle stay active button
  const handleStayActive = () => {
    sessionManager.extendSession();
    onExtend();
    setVisible(false);
  };
  
  // Handle dismiss rate limit warning
  const handleDismissRateLimit = () => {
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
          background: alertType === 'rateLimit' ? colors.errorBackground || '#fee2e2' : colors.warningBackground || '#fffbeb',
          borderColor: alertType === 'rateLimit' ? colors.error || '#ef4444' : colors.warningBorder || '#f59e0b',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle 
              size={18} 
              className="shrink-0"
              style={{ color: alertType === 'rateLimit' ? colors.error || '#ef4444' : colors.warning || '#f59e0b' }} 
            />
            <span style={{ color: colors.foreground }}>
              {alertType === 'session' 
                ? `Your session will expire in ${formatTimeRemaining(timeRemaining)}`
                : rateLimitMessage}
            </span>
          </div>
          {alertType === 'rateLimit' && (
            <button 
              onClick={handleDismissRateLimit} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {alertType === 'session' && (
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
        )}
      </div>
    </div>
  );
};

export default SessionTimeoutAlert;
