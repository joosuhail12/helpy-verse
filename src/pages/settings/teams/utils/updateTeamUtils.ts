
import { updateTeam } from '@/store/slices/teams/teamsSlice';
import { store } from '@/store/store';
import type { TeamCreatePayload } from '@/types/team';

export const updateTeamAction = async (teamId: string, teamData: Partial<TeamCreatePayload>) => {
  try {
    // Transform the teamData to match what the backend expects
    const formattedData = { ...teamData };
    
    // Handle routing structure
    if (teamData.routing) {
      if (teamData.routing.limits) {
        // Add the limits at the top level for the backend
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
      
      // Set the routing strategy for the backend
      (formattedData as any).routingStrategy = teamData.routing.type;
    }
    
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
