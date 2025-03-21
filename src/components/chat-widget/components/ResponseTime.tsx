
import React from 'react';
import { useTheme } from '../theme/ThemeContext';

/**
 * Component displaying powered by information
 */
const ResponseTime = () => {
  const { theme } = useTheme();
  
  return (
    <div className="text-xs text-center py-2 border-t border-gray-100"
      style={{ color: theme.colors.text }}
    >
      Powered by <span style={{ color: theme.colors.accent }} className="font-medium">Pullse</span>
    </div>
  );
};

export default ResponseTime;
