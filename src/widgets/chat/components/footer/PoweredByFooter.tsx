
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';

const PoweredByFooter: React.FC = () => {
  const { colors } = useThemeContext();
  
  return (
    <div 
      className="bg-gray-50 py-2 px-4 text-center border-t text-xs text-gray-500 flex items-center justify-center" 
      style={{ borderColor: colors.border }}
    >
      <span className="mr-1">Powered by</span>
      <div className="flex items-center">
        <img 
          src="https://framerusercontent.com/images/9N8Z1vTRbJsHlrIuTjm6Ajga4dI.png" 
          alt="Pullse Logo" 
          className="h-4 w-auto"
        />
        <span className="ml-1 font-medium">Pullse</span>
      </div>
    </div>
  );
};

export default PoweredByFooter;
