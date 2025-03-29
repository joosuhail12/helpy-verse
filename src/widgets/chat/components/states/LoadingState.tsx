
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  compact?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ compact }) => {
  return (
    <div className={`flex flex-col items-center justify-center h-full ${compact ? 'p-4' : 'p-8'}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">Loading chat...</p>
    </div>
  );
};

export default LoadingState;
