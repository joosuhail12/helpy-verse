
import React from 'react';
import { ArrowRight, Loader2, LockIcon } from 'lucide-react';

interface LoginButtonProps {
  isLoading: boolean;
  isDevelopmentMode?: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ 
  isLoading, 
  isDevelopmentMode = false 
}) => {
  return (
    <button 
      type="submit" 
      className={`w-full ${isDevelopmentMode ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'} text-white font-medium 
               py-3 px-4 rounded-lg transition-all duration-300 ease-in-out 
               flex items-center justify-center gap-2 hover:shadow-lg 
               active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed`}
      disabled={isLoading}
      aria-busy={isLoading}
      data-testid="login-button"
      data-dev-mode={isDevelopmentMode ? "true" : "false"}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          {isDevelopmentMode ? (
            <>
              <LockIcon className="w-4 h-4" />
              <span>Development Mode Sign In</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </>
      )}
    </button>
  );
};
