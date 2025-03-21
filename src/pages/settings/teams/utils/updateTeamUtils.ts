
import { updateTeam } from '@/store/slices/teams/teamsSlice';
import { store } from '@/store/store';
import type { TeamCreatePayload } from '@/types/team';

export const updateTeamAction = async (teamId: string, teamData: any) => {
  try {
    // Transform the teamData to match what the backend expects
    const formattedData = { ...teamData };
    
    console.log('Original team data for update:', teamData);
    
    // Ensure we're passing members correctly
    if (teamData.members) {
      formattedData.members = teamData.members;
    }

    // Ensure channels is properly formatted
    if (teamData.channels) {
      formattedData.channels = {
        chat: teamData.channels.chat,
        email: Array.isArray(teamData.channels.email) ? teamData.channels.email : []
      };
      
      // If email is null, set it to an empty array
      if (formattedData.channels.email === null) {
        formattedData.channels.email = [];
      }
    }
    
    // Ensure officeHours is properly handled
    if (teamData.officeHours) {
      // Make sure each day has an array of time slots
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      days.forEach(day => {
        if (!Array.isArray(teamData.officeHours?.[day])) {
          formattedData.officeHours[day] = [];
        }
      });
    }
    
    // Ensure holidays is an array
    if (teamData.holidays === undefined || teamData.holidays === null) {
      formattedData.holidays = [];
    }
    
    // Make sure to include workspace_id
    formattedData.workspace_id = localStorage.getItem('workspaceId');
    
    console.log('Formatted data for team update:', formattedData);
    
    const resultAction = await store.dispatch(updateTeam({ id: teamId, data: formattedData }));
    
    if (updateTeam.fulfilled.match(resultAction)) {
      console.log('Team updated successfully:', resultAction.payload);
      return { success: true, data: resultAction.payload };
    } else if (updateTeam.rejected.match(resultAction)) {
      console.error('Team update rejected:', resultAction.error);
      throw new Error(resultAction.error.message || 'Failed to update team');
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in updateTeamAction:', error);
    throw error;
  }
};

// Export the updateTeam function directly so it can be imported in EditTeam.tsx
export { updateTeam } from '@/store/slices/teams/teamsSlice';
