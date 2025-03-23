
import { createTeam } from '@/store/slices/teams/teamsSlice';
import { store } from '@/store/store';
import type { TeamCreatePayload } from '@/types/team';

export const createTeamAction = async (teamData: TeamCreatePayload) => {
  try {
    const resultAction = await store.dispatch(createTeam(teamData));
    
    if (createTeam.fulfilled.match(resultAction)) {
      return { success: true, data: resultAction.payload };
    } else if (createTeam.rejected.match(resultAction)) {
      throw new Error(resultAction.payload as string || 'Failed to create team');
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in createTeamAction:', error);
    throw error;
  }
};
