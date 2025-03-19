
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService } from '@/services/teamService';
import type { Team, TeamRouting } from '@/types/team';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for accessing and managing team data
 */
export const useTeamData = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all teams
  const { data: teams, isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: teamService.getTeams,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch a single team
  const getTeam = (id: string) => useQuery({
    queryKey: ['teams', id],
    queryFn: () => teamService.getTeam(id),
    enabled: !!id,
  });

  // Create a new team
  const createTeam = useMutation({
    mutationFn: (data: Partial<Team>) => teamService.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Success",
        description: "Team created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
      console.error("Error creating team:", error);
    },
  });

  // Update a team
  const updateTeam = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Team> }) => 
      teamService.updateTeam(id, data),
    onSuccess: (updatedTeam) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', updatedTeam.id] });
      toast({
        title: "Success",
        description: "Team updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update team",
        variant: "destructive",
      });
      console.error("Error updating team:", error);
    },
  });

  // Delete a team
  const deleteTeam = useMutation({
    mutationFn: (id: string) => teamService.deleteTeam(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.removeQueries({ queryKey: ['teams', id] });
      toast({
        title: "Success",
        description: "Team deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete team",
        variant: "destructive",
      });
      console.error("Error deleting team:", error);
    },
  });

  // Update team routing
  const updateTeamRouting = useMutation({
    mutationFn: ({ teamId, routing }: { teamId: string, routing: TeamRouting }) =>
      teamService.updateTeamRouting(teamId, routing),
    onSuccess: (updatedTeam) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', updatedTeam.id] });
      toast({
        title: "Success",
        description: "Team routing updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update team routing",
        variant: "destructive",
      });
      console.error("Error updating team routing:", error);
    },
  });

  // Update team office hours
  const updateTeamOfficeHours = useMutation({
    mutationFn: ({ teamId, officeHours }: { 
      teamId: string, 
      officeHours: Team['officeHours'] 
    }) => teamService.updateTeamOfficeHours(teamId, officeHours),
    onSuccess: (updatedTeam) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', updatedTeam.id] });
      toast({
        title: "Success",
        description: "Team office hours updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update team office hours",
        variant: "destructive",
      });
      console.error("Error updating team office hours:", error);
    },
  });

  return {
    teams,
    isLoading,
    error,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    updateTeamRouting,
    updateTeamOfficeHours
  };
};
