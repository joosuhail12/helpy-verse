
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { toast } from '@/components/ui/use-toast';
import { fetchCannedResponses, deleteCannedResponse } from '@/store/slices/cannedResponses/actions';
import { selectCannedResponseById } from '@/store/slices/cannedResponses/selectors';

export const useCannedResponseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Use selectors to get data from the store
  const response = useAppSelector(state => selectCannedResponseById(state, id || ''));
  const loading = useAppSelector(state => state.cannedResponses.loading);
  const error = useAppSelector(state => state.cannedResponses.error);
  const teams = useAppSelector(state => state.teams.teams);
  
  useEffect(() => {
    // Fetch all responses
    dispatch(fetchCannedResponses());
  }, [dispatch, id]);
  
  const handleDelete = async () => {
    try {
      if (id) {
        await dispatch(deleteCannedResponse(id)).unwrap();
        toast({
          title: 'Success',
          description: 'Canned response deleted successfully',
        });
        navigate('/home/settings/canned-responses');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete canned response',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);
  
  return {
    response,
    loading,
    error,
    teams,
    isDeleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete
  };
};
