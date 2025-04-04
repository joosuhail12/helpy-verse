
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoginButtonProps {
  isLoading: boolean;
  onDebug?: () => void;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ isLoading, onDebug }) => {
  return (
    <div className="flex flex-col gap-2">
      <Button 
        type="submit" 
        className="w-full rounded-lg py-2.5 bg-primary hover:bg-primary/90 transition-colors duration-300" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
      
      {process.env.NODE_ENV === 'development' && onDebug && (
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="text-xs" 
          onClick={onDebug}
        >
          Debug Connection
        </Button>
      )}
    </div>
  );
};

export default LoginButton;
