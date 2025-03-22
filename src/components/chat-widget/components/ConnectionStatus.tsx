
import React from 'react';
import { WifiOff, AlertCircle, Loader2 } from 'lucide-react';
import AnimatedContainer from '../animations/AnimatedContainer';

interface ConnectionStatusProps {
  connectionState: 'connected' | 'connecting' | 'disconnected' | 'failed' | 'offline';
  hasQueuedMessages: boolean;
  onRetry: () => void;
}

/**
 * Component to show connection status with appropriate visuals and actions
 */
const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connectionState,
  hasQueuedMessages,
  onRetry
}) => {
  if (connectionState === 'connected') return null;
  
  return (
    <AnimatedContainer animation="fadeIn" className="p-2 border-t border-gray-200 flex items-center justify-between text-sm">
      {connectionState === 'connecting' && (
        <div className="flex items-center text-amber-500 w-full justify-center py-1">
          <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
          <span>Connecting...</span>
        </div>
      )}
      
      {connectionState === 'disconnected' && (
        <div className="flex items-center text-amber-500 w-full justify-between py-1 px-2">
          <div className="flex items-center">
            <AlertCircle className="h-3.5 w-3.5 mr-2" />
            <span>Connection lost. Reconnecting...</span>
          </div>
        </div>
      )}
      
      {connectionState === 'failed' && (
        <div className="flex items-center text-red-500 w-full justify-between py-1 px-2">
          <div className="flex items-center">
            <AlertCircle className="h-3.5 w-3.5 mr-2" />
            <span>Connection failed</span>
          </div>
          <button 
            onClick={onRetry}
            className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors transform hover:scale-105 transition-transform duration-200"
          >
            Retry
          </button>
        </div>
      )}
      
      {connectionState === 'offline' && (
        <div className="flex items-center text-gray-500 w-full justify-between py-1 px-2">
          <div className="flex items-center">
            <WifiOff className="h-3.5 w-3.5 mr-2" />
            <span>You're offline{hasQueuedMessages ? ', messages will send when connected' : ''}</span>
          </div>
          <button 
            onClick={onRetry}
            className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors transform hover:scale-105 transition-transform duration-200"
          >
            Retry
          </button>
        </div>
      )}
    </AnimatedContainer>
  );
};

export default ConnectionStatus;
