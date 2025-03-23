import { useDispatch } from 'react-redux';
import { fetchTeams } from '@/store/slices/teams/teamsSlice';

interface UpdateTeamParams {
  teamId: string;
  name: string;
  description: string;
  logo: string | null;
  removeLogo: boolean;
}

export const updateTeamUtils = () => {
  const dispatch = useDispatch();

  const handleUpdateTeam = async ({
    teamId,
    name,
    description,
    logo,
    removeLogo,
  }: UpdateTeamParams) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);

      if (logo) {
        formData.append('logo', logo);
      }

      formData.append('removeLogo', String(removeLogo));

      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update team:', errorData);
        throw new Error(errorData.message || 'Failed to update team');
      }

      // Optimistically update the team in the Redux store
      dispatch(fetchTeams());

      return { success: true, message: 'Team updated successfully' };
    } catch (error: any) {
      console.error('Error updating team:', error);
      return { success: false, message: error.message || 'Failed to update team' };
    }
  };

  return { handleUpdateTeam };
};
