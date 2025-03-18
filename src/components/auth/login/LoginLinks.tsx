
import React from 'react';
import { Link } from 'react-router-dom';

export const LoginLinks: React.FC = () => {
  return (
    <div className="flex items-center justify-between pt-2 text-sm">
      <Link
        to="/sign-up"
        className="text-primary hover:text-primary/80 font-medium transition-all duration-300 
                 ease-in-out hover:translate-x-0.5 transform flex items-center gap-1"
      >
        Create account
      </Link>
      <Link
        to="/forgot-password"
        className="text-primary hover:text-primary/80 font-medium transition-all duration-300 
                 ease-in-out hover:translate-x-0.5 transform flex items-center gap-1"
      >
        Forgot password?
      </Link>
    </div>
  );
};
