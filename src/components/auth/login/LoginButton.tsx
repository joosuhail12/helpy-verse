
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoginButtonProps {
  isLoading: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ isLoading }) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        'Sign In'
      )}
    </Button>
  );
};
