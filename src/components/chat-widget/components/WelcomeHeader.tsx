
import React from 'react';

/**
 * Welcome header component displaying a greeting to the user
 */
const WelcomeHeader = () => {
  return (
    <div className="bg-[#5DCFCF] px-6 py-12 rounded-t-lg shadow-sm">
      <h2 className="text-2xl font-bold text-white mt-4">Hey there!</h2>
      <p className="text-white opacity-90 font-medium mt-1">
        How can I help you?
      </p>
    </div>
  );
};

export default WelcomeHeader;
