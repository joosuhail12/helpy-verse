
import api from '@/api/Api';
import { store } from '@/store/store';
import { updateTeam as updateTeamAction } from '@/store/slices/teams/teamsSlice';

export const updateTeam = async (teamId: string, teamData: any) => {
  try {
    // In a real application, this would be an API call
    const response = await api.put(`/teams/${teamId}`, teamData);
    
    // If we're using mock data or the API call is not implemented, 
    // simulate a successful response by updating the Redux store directly
    if (!response || !response.data) {
      // Dispatch the action to update the team in Redux store
      store.dispatch(updateTeamAction({ 
        id: teamId, 
        updates: teamData 
      }));
      
      return true;
    }

    return true;
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
};
