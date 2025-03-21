
import React from 'react';

/**
 * Welcome header component displaying a greeting to the user
 */
const WelcomeHeader = () => {
  return (
    <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-6 py-8 rounded-b-2xl">
      <h2 className="text-xl font-semibold text-gray-800">Hey there 👋</h2>
      <p className="text-gray-600 mt-1 font-light">
        We're here to help. What can we do for you today?
      </p>
    </div>
  );
};

export default WelcomeHeader;
