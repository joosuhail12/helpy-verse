
import { updateTeam } from '@/store/slices/teams/teamsSlice';
import { store } from '@/store/store';
import type { TeamCreatePayload } from '@/types/team';

export const updateTeamAction = async (teamId: string, teamData: Partial<TeamCreatePayload>) => {
  try {
    const resultAction = await store.dispatch(updateTeam({ id: teamId, data: teamData }));
    
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
