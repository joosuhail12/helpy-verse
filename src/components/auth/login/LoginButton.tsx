
import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface LoginButtonProps {
  isLoading: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ isLoading }) => {
  return (
    <button 
      type="submit" 
      className="w-full bg-primary hover:bg-primary/90 text-white font-medium 
               py-3 px-4 rounded-lg transition-all duration-300 ease-in-out 
               flex items-center justify-center gap-2 hover:shadow-lg 
               active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
      disabled={isLoading}
      aria-busy={isLoading}
      data-testid="login-button"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
};
