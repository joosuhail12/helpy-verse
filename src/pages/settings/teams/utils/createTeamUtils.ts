
import api from '@/services/api';

export const createTeam = async (teamData: any) => {
  try {
    const response = await api.post('/teams', teamData);

    if (!response.data) {
      throw new Error('Failed to create team');
    }

    return true;
  } catch (error) {
    throw error;
  }
};
