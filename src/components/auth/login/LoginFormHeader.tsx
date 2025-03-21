
import React from 'react';

export const LoginFormHeader: React.FC = () => {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-gray-800 transition-colors duration-300 hover:text-primary">
        Welcome back
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed transition-colors duration-300">
        Enter your credentials to access your account
      </p>
    </div>
  );
};
