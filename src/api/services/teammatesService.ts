
import api from '../Api';
import { Teammate, NewTeammate } from '@/types/teammate';

export const getTeammates = async (): Promise<Teammate[]> => {
  try {
    const response = await api.get('/user');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching teammates:', error);
    throw error;
  }
};

export const getTeammateById = async (id: string): Promise<Teammate> => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching teammate with ID ${id}:`, error);
    throw error;
  }
};

export const createTeammate = async (teammateData: NewTeammate): Promise<Teammate> => {
  try {
    const response = await api.post('/user', teammateData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating teammate:', error);
    throw error;
  }
};

export const updateTeammateData = async (id: string, updates: Partial<Teammate>): Promise<Teammate> => {
  try {
    const response = await api.put(`/user/${id}`, updates);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating teammate with ID ${id}:`, error);
    throw error;
  }
};

export const deleteTeammate = async (id: string): Promise<void> => {
  try {
    await api.delete(`/user/${id}`);
  } catch (error) {
    console.error(`Error deleting teammate with ID ${id}:`, error);
    throw error;
  }
};

export const resendTeammateInvitation = async (id: string): Promise<void> => {
  try {
    await api.post(`/user/${id}/resend-invitation`);
  } catch (error) {
    console.error(`Error resending invitation to teammate with ID ${id}:`, error);
    throw error;
  }
};
