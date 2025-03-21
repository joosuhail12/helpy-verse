
import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoginButtonProps {
  isLoading: boolean;
  isDevelopmentMode?: boolean;
}

/**
 * Login button component with loading state
 */
export const LoginButton: React.FC<LoginButtonProps> = ({ 
  isLoading 
}) => {
  return (
    <Button 
      type="submit" 
      className="w-full py-3 px-4 rounded-lg transition-all duration-300 ease-in-out 
               flex items-center justify-center gap-2 hover:shadow-lg 
               active:scale-[0.98]"
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
    </Button>
  );
};
