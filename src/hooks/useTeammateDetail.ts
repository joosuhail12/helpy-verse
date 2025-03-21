
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeammateDetails, fetchTeammates } from '@/store/slices/teammates/actions';
import { selectTeammateById, selectTeammateDetailsLoading } from '@/store/slices/teammates/selectors';
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated } from '@/utils/auth/tokenManager';
import type { Teammate } from '@/types/teammate';

/**
 * Hook for fetching and managing a specific teammate's data
 */
export const useTeammateDetail = (teammateId: string | undefined) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get teammate from the Redux store first (if already loaded)
  const teammate = useAppSelector(state => 
    teammateId ? selectTeammateById(state, teammateId) : null
  );
  
  const detailsLoading = useAppSelector(selectTeammateDetailsLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teammateId) {
      setIsLoading(false);
      setError('No teammate ID provided');
      return;
    }

    // First check if we're authenticated
    if (!isAuthenticated()) {
      console.warn('User is not authenticated, cannot fetch teammate details');
      toast({
        title: "Authentication Required",
        description: "Please sign in to view teammate details.",
        variant: "destructive",
      });
      setIsLoading(false);
      setError('Authentication required');
      return;
    }

    const workspaceId = localStorage.getItem('workspaceId');
    if (!workspaceId) {
      toast({
        title: "Workspace ID Missing",
        description: "No workspace ID found. Please refresh the page.",
        variant: "destructive",
      });
      setIsLoading(false);
      setError('Workspace ID required');
      return;
    }

    // If the teammate isn't already in the store, fetch all teammates first
    if (!teammate) {
      console.log(`Teammate ${teammateId} not found in store, fetching all teammates first`);
      setIsLoading(true);
      
      dispatch(fetchTeammates())
        .unwrap()
        .then(() => {
          // After loading all teammates, check if our target teammate was loaded
          const loadedTeammate = selectTeammateById(dispatch.getState(), teammateId);
          
          if (!loadedTeammate) {
            // If still not found, fetch the specific teammate details
            console.log(`Teammate ${teammateId} still not found, fetching specific details`);
            return dispatch(fetchTeammateDetails(teammateId)).unwrap();
          }
          return loadedTeammate;
        })
        .catch(err => {
          console.error('Error fetching teammate:', err);
          setError(typeof err === 'string' ? err : 'Failed to load teammate details');
          toast({
            title: "Error Loading Teammate",
            description: typeof err === 'string' ? err : "Failed to load teammate details. Please try again.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // If teammate is already in store, just fetch their details to ensure we have the latest data
      dispatch(fetchTeammateDetails(teammateId))
        .unwrap()
        .catch(err => {
          console.error('Error fetching teammate details:', err);
          // Don't show error toast since we already have basic teammate data
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [dispatch, teammateId, toast, teammate]);

  // Return the teammate from the store and the loading state
  return {
    teammate,
    isLoading: isLoading || detailsLoading,
    error
  };
};
