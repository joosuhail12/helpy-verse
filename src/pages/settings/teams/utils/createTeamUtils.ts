import { useDispatch } from 'react-redux';
import { fetchTeams } from '@/store/slices/teams/teamsSlice';

export const handleCreateTeam = async (teamName: string, teamDescription: string, dispatch: any, onClose: () => void) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Dispatch action to add the new team (assuming you have an addTeam action)
    // In a real application, you would dispatch an async thunk that calls your API
    // and then dispatches a success action with the new team data
    // dispatch(addTeam({
    //   id: Math.random().toString(36).substring(2, 15), // Generate a random ID
    //   name: teamName,
    //   description: teamDescription,
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // }));

    // After "API call", fetch teams to update the state
    dispatch(fetchTeams());

    // Close the dialog
    onClose();
  } catch (error) {
    console.error("Failed to create team:", error);
    // Handle error (e.g., show an error message)
  }
};
