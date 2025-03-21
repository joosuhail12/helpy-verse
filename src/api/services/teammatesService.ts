
import api from '../Api';
import { Teammate, NewTeammate } from '@/types/teammate';
import { getAuthToken } from '@/utils/auth/tokenManager';

// Make sure we're using the correct API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || '/api';

export const getTeammates = async (): Promise<Teammate[]> => {
  try {
    // Get workspace ID directly from localStorage to ensure it's included
    const workspaceId = localStorage.getItem('workspaceId');
    
    if (!workspaceId) {
      console.error('No workspace ID found in localStorage');
      throw new Error('No workspace ID found. Please refresh the page and try again.');
    }
    
    console.log(`Fetching teammates for workspace: ${workspaceId} from ${API_BASE_URL}/user`);
    
    // Get auth token to log for debugging
    const authToken = getAuthToken();
    console.log(`Using auth token: ${authToken ? 'Yes (token exists)' : 'No (token missing)'}`);
    
    if (!authToken) {
      throw new Error('Authentication token not found. Please sign in again.');
    }
    
    const response = await api.get('/user', {
      params: {
        workspace_id: workspaceId
      },
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    // Added more detailed logging to diagnose the response structure
    console.log('Raw API response:', response);
    
    if (!response.data) {
      console.error('API response missing data:', response);
      return [];
    }
    
    // Handle different response structures
    const teammates = response.data.data || response.data;
    
    if (!Array.isArray(teammates)) {
      console.error('API response is not an array:', teammates);
      return [];
    }
    
    console.log(`Successfully retrieved ${teammates.length} teammates`);
    return teammates;
  } catch (error) {
    console.error('Error fetching teammates:', error);
    throw error;
  }
};

export const getTeammateById = async (id: string): Promise<Teammate> => {
  try {
    const workspaceId = localStorage.getItem('workspaceId');
    
    if (!workspaceId) {
      console.error('No workspace ID found in localStorage');
      throw new Error('No workspace ID found. Please refresh the page and try again.');
    }
    
    // Get auth token
    const authToken = getAuthToken();
    console.log(`Fetching teammate ${id} with auth token: ${authToken ? 'Yes (token exists)' : 'No (token missing)'}`);
    
    if (!authToken) {
      throw new Error('Authentication token not found. Please sign in again.');
    }
    
    console.log(`Fetching teammate with ID ${id} for workspace: ${workspaceId}`);
    
    const response = await api.get(`/user/${id}`, {
      params: {
        workspace_id: workspaceId
      },
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log(`Teammate ${id} API response:`, response);
    
    if (!response.data) {
      console.error(`API response missing data for teammate ${id}:`, response);
      throw new Error('Invalid response from server');
    }
    
    // Handle different response structures
    const teammate = response.data.data || response.data;
    
    if (!teammate || typeof teammate !== 'object') {
      console.error(`Invalid teammate data for ID ${id}:`, teammate);
      throw new Error('Invalid teammate data received from server');
    }
    
    console.log(`Successfully retrieved teammate with ID ${id}`);
    return teammate;
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
