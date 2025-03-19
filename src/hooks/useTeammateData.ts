
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { teammateService } from '@/services/teammateService';
import type { Teammate } from '@/types/teammate';

export const useTeammateData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch teammates
  const { data: teammates, isLoading: isLoadingTeammates, error } = useQuery({
    queryKey: ['teammates'],
    queryFn: () => teammateService.getTeammates(),
  });

  // Create teammate
  const createTeammateMutation = useMutation({
    mutationFn: (teammateData: Omit<Teammate, 'id'>) => {
      return teammateService.createTeammate(teammateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teammates'] });
      toast({
        title: "Success",
        description: "Teammate created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating teammate:', error);
      toast({
        title: "Error",
        description: "Failed to create teammate. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update teammate
  const updateTeammateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Teammate> }) => {
      return teammateService.updateTeammate(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teammates'] });
      toast({
        title: "Success",
        description: "Teammate updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating teammate:', error);
      toast({
        title: "Error",
        description: "Failed to update teammate. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete teammate
  const deleteTeammateMutation = useMutation({
    mutationFn: (id: string) => {
      return teammateService.deleteTeammate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teammates'] });
      toast({
        title: "Success",
        description: "Teammate deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting teammate:', error);
      toast({
        title: "Error",
        description: "Failed to delete teammate. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createTeammate = useCallback(async (teammateData: Omit<Teammate, 'id'>) => {
    setIsLoading(true);
    try {
      await createTeammateMutation.mutateAsync(teammateData);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [createTeammateMutation]);

  const updateTeammate = useCallback(async (id: string, data: Partial<Teammate>) => {
    setIsLoading(true);
    try {
      await updateTeammateMutation.mutateAsync({ id, data });
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateTeammateMutation]);

  const deleteTeammate = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await deleteTeammateMutation.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [deleteTeammateMutation]);

  return {
    teammates,
    isLoading: isLoading || isLoadingTeammates,
    error,
    createTeammate,
    updateTeammate,
    deleteTeammate
  };
};
