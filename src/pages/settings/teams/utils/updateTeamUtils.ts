
import { updateTeam } from '@/store/slices/teams/teamsSlice';
import { store } from '@/store/store';
import type { TeamCreatePayload } from '@/types/team';

export const updateTeamAction = async (teamId: string, teamData: Partial<TeamCreatePayload>) => {
  try {
    // Transform the teamData to match what the backend expects
    const formattedData = { ...teamData };
    
    // Handle routing structure
    if (teamData.routing) {
      // Set the routing strategy for the backend
      (formattedData as any).routingStrategy = teamData.routing.type;
      
      // Add the limits at the top level for the backend
      if (teamData.routing.limits) {
        if (teamData.routing.limits.maxTotalTickets !== undefined) {
          (formattedData as any).maxTotalTickets = teamData.routing.limits.maxTotalTickets;
        }
        if (teamData.routing.limits.maxOpenTickets !== undefined) {
          (formattedData as any).maxOpenTickets = teamData.routing.limits.maxOpenTickets;
        }
        if (teamData.routing.limits.maxActiveChats !== undefined) {
          (formattedData as any).maxActiveChats = teamData.routing.limits.maxActiveChats;
        }
      }
      
      // Remove the routing property as it's not expected by the backend
      delete (formattedData as any).routing;
    }
    
    // Ensure we're passing members, not teamMembers to the backend
    if (teamData.members) {
      (formattedData as any).members = teamData.members;
    }

    // Ensure channels is properly formatted
    if (teamData.channels && teamData.channels.email === null) {
      formattedData.channels = {
        ...teamData.channels,
        email: []
      };
    }
    
    console.log('Formatted data for team update:', formattedData);
    
    const resultAction = await store.dispatch(updateTeam({ id: teamId, data: formattedData }));
    
    if (updateTeam.fulfilled.match(resultAction)) {
      return { success: true, data: resultAction.payload };
    } else if (updateTeam.rejected.match(resultAction)) {
      throw new Error(resultAction.payload as string || 'Failed to update team');
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in updateTeamAction:', error);
    throw error;
  }
};

// Export the updateTeam function directly so it can be imported in EditTeam.tsx
export { updateTeam } from '@/store/slices/teams/teamsSlice';
