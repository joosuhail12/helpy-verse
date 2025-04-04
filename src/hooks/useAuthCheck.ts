
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/authService';
import { WorkspaceService } from '@/services/workspaceService';
import { toast } from '@/components/ui/use-toast';

/**
 * Custom hook for handling authentication checks before data fetching
 * @returns Object containing authentication status, loading state, and error
 */
export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check if user is authenticated
        if (!AuthService.isAuthenticated()) {
          console.warn('User is not authenticated, redirecting to login');
          setError('Authentication required');
          navigate('/sign-in', { replace: true });
          return;
        }

        // Check if workspace ID exists
        if (!WorkspaceService.hasWorkspaceId()) {
          console.warn('No workspace ID found');
          setError('Workspace ID required');
          
          toast({
            title: "Workspace Error",
            description: "No workspace selected. Please log in again.",
            variant: "destructive",
          });
          
          // Force re-login to get workspace ID
          AuthService.logout();
          return;
        }

        // Authentication and workspace checks passed
        setIsAuthenticated(true);
        setError(null);
      } catch (err) {
        console.error('Error during authentication check:', err);
        setError('Failed to verify authentication');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  return { isAuthenticated, isLoading, error };
};
