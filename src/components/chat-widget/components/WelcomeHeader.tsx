
import React from 'react';
import { useTheme } from '../theme/ThemeContext';

/**
 * Welcome header component displaying a greeting to the user
 * Styled similarly to Intercom's dark header with light text
 */
const WelcomeHeader = () => {
  const { theme } = useTheme();
  
  return (
    <div 
      className="px-6 py-10 rounded-t-lg shadow-sm"
      style={{ backgroundColor: theme.colors.headerBackground }}
    >
      <div className="mb-4">
        {theme.logoUrl ? (
          <img 
            src={theme.logoUrl} 
            alt="Company logo" 
            className="w-8 h-8 rounded-md"
          />
        ) : (
          <div className="bg-white/90 w-8 h-8 rounded-md flex items-center justify-center">
            <svg viewBox="0 0 28 28" fill="currentColor" 
              className="w-5 h-5" 
              style={{ color: theme.colors.primary }}
            >
              <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2zm5.595 9.812l-4.83 7.583a.805.805 0 0 1-1.134.186l-3.525-2.804a.803.803 0 0 1-.103-1.128.804.804 0 0 1 1.128-.103l2.847 2.266 4.303-6.752a.803.803 0 0 1 1.116-.214.804.804 0 0 1 .198 1.116z" />
            </svg>
          </div>
        )}
      </div>
      <h2 
        className="text-2xl font-medium" 
        style={{ color: theme.colors.headerText }}
      >
        Hello there.
      </h2>
      <p 
        className="text-2xl font-medium mt-1"
        style={{ color: theme.colors.headerText }}
      >
        How can we help?
      </p>
    </div>
  );
};

export default WelcomeHeader;
