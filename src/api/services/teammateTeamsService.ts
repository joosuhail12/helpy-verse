
import api from '../Api';
import { Teammate, TeamAssignment } from '@/types/teammate';

export const getTeammateTeams = async (teammateId: string): Promise<TeamAssignment[]> => {
  try {
    const response = await api.get(`/user/${teammateId}/teams`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching teams for teammate with ID ${teammateId}:`, error);
    throw error;
  }
};

export const assignTeammateToTeam = async (
  teammateId: string, 
  teamId: string, 
  role: string
): Promise<TeamAssignment> => {
  try {
    const response = await api.post(`/teams/${teamId}/members`, {
      userId: teammateId,
      role
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error assigning teammate ${teammateId} to team ${teamId}:`, error);
    throw error;
  }
};

export const removeTeammateFromTeam = async (
  teammateId: string, 
  teamId: string
): Promise<void> => {
  try {
    await api.delete(`/teams/${teamId}/members/${teammateId}`);
  } catch (error) {
    console.error(`Error removing teammate ${teammateId} from team ${teamId}:`, error);
    throw error;
  }
};
