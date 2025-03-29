
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  compact?: boolean;
  message?: string;
  className?: string;
}

/**
 * Loading state component with customizable message
 */
const LoadingState: React.FC<LoadingStateProps> = ({ 
  compact = false, 
  message = 'Loading chat...', 
  className = '' 
}) => {
  return (
    <div className={`
      flex flex-col items-center justify-center h-full
      ${compact ? 'p-4' : 'p-6'} 
      ${className}
    `}>
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingState;
