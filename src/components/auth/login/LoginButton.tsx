
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LoginButtonProps {
  isLoading: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ isLoading }) => {
  return (
    <button 
      type="submit" 
      className="w-full bg-primary hover:bg-primary/90 text-white font-medium 
               py-2.5 px-4 rounded-lg transition-all duration-300 ease-in-out 
               flex items-center justify-center gap-2 hover:shadow-lg 
               active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
      disabled={isLoading}
    >
      {isLoading ? 'Signing in...' : 'Sign In'}
      {!isLoading && <ArrowRight className="w-4 h-4" />}
    </button>
  );
};
