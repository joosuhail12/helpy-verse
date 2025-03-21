
import api from '../Api';
import { Teammate, NewTeammate } from '@/types/teammate';

export const getTeammates = async (): Promise<Teammate[]> => {
  try {
    // Get workspace ID directly from localStorage to ensure it's included
    const workspaceId = localStorage.getItem('workspaceId');
    const response = await api.get('/user', {
      params: {
        workspace_id: workspaceId
      }
    });
    
    if (!response.data || !response.data.data) {
      console.error('API response missing data structure:', response);
      return [];
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching teammates:', error);
    throw error;
  }
};

export const getTeammateById = async (id: string): Promise<Teammate> => {
  try {
    const workspaceId = localStorage.getItem('workspaceId');
    const response = await api.get(`/user/${id}`, {
      params: {
        workspace_id: workspaceId
      }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching teammate with ID ${id}:`, error);
    throw error;
  }
};

export const createTeammate = async (teammateData: NewTeammate): Promise<Teammate> => {
  try {
    const workspaceId = localStorage.getItem('workspaceId');
    const response = await api.post('/user', teammateData, {
      params: {
        workspace_id: workspaceId
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating teammate:', error);
    throw error;
  }
};

export const updateTeammateData = async (id: string, updates: Partial<Teammate>): Promise<Teammate> => {
  try {
    const workspaceId = localStorage.getItem('workspaceId');
    const response = await api.put(`/user/${id}`, updates, {
      params: {
        workspace_id: workspaceId
      }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating teammate with ID ${id}:`, error);
    throw error;
  }
};

export const deleteTeammate = async (id: string): Promise<void> => {
  try {
    const workspaceId = localStorage.getItem('workspaceId');
    await api.delete(`/user/${id}`, {
      params: {
        workspace_id: workspaceId
      }
    });
  } catch (error) {
    console.error(`Error deleting teammate with ID ${id}:`, error);
    throw error;
  }
};

export const resendTeammateInvitation = async (id: string): Promise<void> => {
  try {
    const workspaceId = localStorage.getItem('workspaceId');
    await api.post(`/user/${id}/resend-invitation`, {}, {
      params: {
        workspace_id: workspaceId
      }
    });
  } catch (error) {
    console.error(`Error resending invitation to teammate with ID ${id}:`, error);
    throw error;
  }
};
