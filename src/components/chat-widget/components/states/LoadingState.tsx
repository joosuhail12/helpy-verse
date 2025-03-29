
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';

interface LoadingStateProps {
  compact?: boolean;
}

/**
 * Loading state component for the chat widget
 */
const LoadingState: React.FC<LoadingStateProps> = ({ compact = false }) => {
  const { colors } = useThemeContext();
  
  return (
    <div 
      className={`flex flex-col h-full text-gray-900 ${compact ? 'max-w-xs' : 'w-full'}`} 
      style={{ backgroundColor: colors.background, color: colors.foreground }}
    >
      <div className="flex-1 flex items-center justify-center">
        <div 
          className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full" 
          style={{ 
            borderColor: colors.primary, 
            borderTopColor: 'transparent' 
          }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingState;
