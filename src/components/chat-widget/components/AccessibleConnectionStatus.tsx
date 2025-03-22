
import React from 'react';
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  connectionState: 'connected' | 'connecting' | 'disconnected' | 'failed' | 'offline';
  hasQueuedMessages?: boolean;
  queuedMessageCount?: number;
  onRetry?: () => void;
}

/**
 * Accessible connection status indicator with proper ARIA attributes
 */
const AccessibleConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connectionState,
  hasQueuedMessages = false,
  queuedMessageCount = 0,
  onRetry
}) => {
  // Don't render if connected
  if (connectionState === 'connected' && !hasQueuedMessages) {
    return null;
  }
  
  const getStatusDetails = () => {
    switch (connectionState) {
      case 'connecting':
        return {
          icon: <Wifi className="h-4 w-4 animate-pulse" aria-hidden="true" />,
          text: 'Connecting...',
          description: 'Attempting to establish connection',
          variant: 'warning'
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="h-4 w-4" aria-hidden="true" />,
          text: 'Disconnected',
          description: 'You are currently disconnected',
          variant: 'warning'
        };
      case 'failed':
        return {
          icon: <AlertTriangle className="h-4 w-4" aria-hidden="true" />,
          text: 'Connection Failed',
          description: 'Unable to establish connection',
          variant: 'error'
        };
      case 'offline':
        return {
          icon: <WifiOff className="h-4 w-4" aria-hidden="true" />,
          text: 'Offline',
          description: hasQueuedMessages 
            ? `Messages will be sent when you're back online (${queuedMessageCount} queued)`
            : 'You are currently offline',
          variant: 'warning'
        };
      default:
        return {
          icon: <AlertTriangle className="h-4 w-4" aria-hidden="true" />,
          text: 'Unknown Status',
          description: 'Status unknown',
          variant: 'warning'
        };
    }
  };
  
  const { icon, text, description, variant } = getStatusDetails();
  
  return (
    <div 
      className={`flex items-center justify-between px-4 py-2 text-sm ${
        variant === 'error' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        {icon}
        <div className="flex flex-col">
          <span className="font-medium">{text}</span>
          <span className="text-xs">{description}</span>
        </div>
      </div>
      
      {onRetry && (connectionState === 'failed' || connectionState === 'offline') && (
        <button
          onClick={onRetry}
          className={`px-2.5 py-1.5 text-xs font-medium rounded ${
            variant === 'error' 
              ? 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500' 
              : 'bg-amber-100 text-amber-800 hover:bg-amber-200 focus:ring-amber-500'
          } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
          aria-label="Retry connection"
        >
          <div className="flex items-center gap-1.5">
            <RefreshCw className="h-3 w-3" aria-hidden="true" />
            <span>{hasQueuedMessages ? 'Send Queued' : 'Retry'}</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default AccessibleConnectionStatus;
