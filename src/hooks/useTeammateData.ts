
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teammateService } from '@/services/teammateService';
import type { Teammate, NewTeammate } from '@/types/teammate';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for accessing and managing teammate data
 */
export const useTeammateData = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all teammates
  const { data: teammates, isLoading, error } = useQuery({
    queryKey: ['teammates'],
    queryFn: teammateService.getTeammates,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch a single teammate
  const getTeammate = (id: string) => useQuery({
    queryKey: ['teammates', id],
    queryFn: () => teammateService.getTeammate(id),
    enabled: !!id,
  });

  // Fetch activity logs for a teammate
  const getTeammateActivityLogs = (teammateId: string) => useQuery({
    queryKey: ['teammates', teammateId, 'activity'],
    queryFn: () => teammateService.getTeammateActivityLogs(teammateId),
    enabled: !!teammateId,
  });

  // Fetch assignments for a teammate
  const getTeammateAssignments = (teammateId: string) => useQuery({
    queryKey: ['teammates', teammateId, 'assignments'],
    queryFn: () => teammateService.getTeammateAssignments(teammateId),
    enabled: !!teammateId,
  });

  // Fetch sessions for a teammate
  const getTeammateSessions = (teammateId: string) => useQuery({
    queryKey: ['teammates', teammateId, 'sessions'],
    queryFn: () => teammateService.getTeammateSessions(teammateId),
    enabled: !!teammateId,
  });

  // Create a new teammate
  const addTeammate = useMutation({
    mutationFn: (data: NewTeammate) => teammateService.createTeammate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teammates'] });
      toast({
        title: "Success",
        description: "Teammate added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add teammate",
        variant: "destructive",
      });
      console.error("Error adding teammate:", error);
    },
  });

  // Update a teammate
  const updateTeammate = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Teammate> }) => 
      teammateService.updateTeammate(id, data),
    onSuccess: (updatedTeammate) => {
      queryClient.invalidateQueries({ queryKey: ['teammates'] });
      queryClient.invalidateQueries({ queryKey: ['teammates', updatedTeammate.id] });
      toast({
        title: "Success",
        description: "Teammate updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update teammate",
        variant: "destructive",
      });
      console.error("Error updating teammate:", error);
    },
  });

  // Terminate a session
  const terminateSession = useMutation({
    mutationFn: ({ teammateId, sessionId }: { teammateId: string, sessionId: string }) => 
      teammateService.terminateSession(teammateId, sessionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teammates', variables.teammateId, 'sessions'] });
      toast({
        title: "Success",
        description: "Session terminated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive",
      });
      console.error("Error terminating session:", error);
    },
  });

  // Reset password
  const resetPassword = useMutation({
    mutationFn: (teammateId: string) => teammateService.resetPassword(teammateId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password reset email sent",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive",
      });
      console.error("Error resetting password:", error);
    },
  });

  // Resend invitation
  const resendInvitation = useMutation({
    mutationFn: (teammateId: string) => teammateService.resendInvitation(teammateId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invitation email resent",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to resend invitation",
        variant: "destructive",
      });
      console.error("Error resending invitation:", error);
    },
  });

  return {
    teammates,
    isLoading,
    error,
    getTeammate,
    getTeammateActivityLogs,
    getTeammateAssignments,
    getTeammateSessions,
    addTeammate,
    updateTeammate,
    terminateSession,
    resetPassword,
    resendInvitation
  };
};
