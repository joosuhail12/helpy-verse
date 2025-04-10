
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeammates } from '@/store/slices/teammates/actions';
import { useToast } from "@/hooks/use-toast";
import { selectAllTeammates, selectTeammatesLoading, selectTeammatesError } from '@/store/slices/teammates/selectors';
import { isAuthenticated } from '@/utils/auth/tokenManager';

/**
 * Hook for fetching and managing teammates data
 */
export const useTeammatesData = () => {
  const dispatch = useAppDispatch();
  const teammates = useAppSelector(selectAllTeammates);
  const loading = useAppSelector(selectTeammatesLoading);
  const error = useAppSelector(selectTeammatesError);
  const { toast } = useToast();
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('workspaceId') && import.meta.env.DEV) {
      const defaultWorkspaceId = '6c22b22f-7bdf-43db-b7c1-9c5884125c63';
      localStorage.setItem('workspaceId', defaultWorkspaceId);
      console.log(`Set default workspace ID for development: ${defaultWorkspaceId}`);
    }
  }, []);

  useEffect(() => {
    // First check if we're authenticated before even attempting to fetch teammates
    if (!isAuthenticated()) {
      console.warn('User is not authenticated, cannot fetch teammates');
      toast({
        title: "Authentication Required",
        description: "Please sign in to view teammates.",
        variant: "destructive",
      });
      return;
    }

    const workspaceId = localStorage.getItem('workspaceId');
    if (workspaceId) {
      console.log(`Initial teammates fetch with workspace ID: ${workspaceId}`);
      dispatch(fetchTeammates())
        .unwrap()
        .catch(err => {
          console.error('Error in initial teammates fetch:', err);
          
          // Handle authentication errors specially
          if (typeof err === 'string' && err.includes('authentication')) {
            toast({
              title: "Authentication Error",
              description: "Your session may have expired. Please sign in again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error Loading Teammates",
              description: typeof err === 'string' ? err : "Failed to load teammates. Please try again.",
              variant: "destructive",
            });
          }
        });
    } else {
      toast({
        title: "Workspace ID Missing",
        description: "No workspace ID found. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [dispatch, toast]);

  const handleRetry = () => {
    setRetrying(true);
    
    // Check authentication first
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view teammates.",
        variant: "destructive",
      });
      setRetrying(false);
      return;
    }
    
    const workspaceId = localStorage.getItem('workspaceId');
    if (!workspaceId) {
      toast({
        title: "Workspace ID Missing",
        description: "No workspace ID found. Please refresh the page.",
        variant: "destructive",
      });
      setRetrying(false);
      return;
    }
    
    dispatch(fetchTeammates())
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "Teammates data refreshed successfully.",
        });
      })
      .catch((err) => {
        const errorMessage = typeof err === 'string' 
          ? err 
          : err?.message || "Failed to fetch teammates. Please try again.";
          
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      })
      .finally(() => {
        setRetrying(false);
      });
  };

  return {
    teammates,
    loading,
    error,
    retrying,
    handleRetry
  };
};
