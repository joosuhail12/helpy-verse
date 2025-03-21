
import React from 'react';

/**
 * Welcome header component displaying a greeting to the user
 * Styled similarly to Intercom's dark header with light text
 */
const WelcomeHeader = () => {
  return (
    <div className="bg-gray-900 px-6 py-10 rounded-t-lg shadow-sm">
      <div className="mb-4">
        <div className="bg-white/90 w-8 h-8 rounded-md flex items-center justify-center">
          <svg viewBox="0 0 28 28" fill="currentColor" className="w-5 h-5 text-gray-900">
            <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2zm5.595 9.812l-4.83 7.583a.805.805 0 0 1-1.134.186l-3.525-2.804a.803.803 0 0 1-.103-1.128.804.804 0 0 1 1.128-.103l2.847 2.266 4.303-6.752a.803.803 0 0 1 1.116-.214.804.804 0 0 1 .198 1.116z" />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-medium text-white">Hello there.</h2>
      <p className="text-white text-2xl font-medium mt-1">
        How can we help?
      </p>
    </div>
  );
};

export default WelcomeHeader;
