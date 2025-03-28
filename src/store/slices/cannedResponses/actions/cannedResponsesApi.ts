
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { CannedResponse } from '@/mock/cannedResponses';
import { 
  setLoading, 
  setError, 
  setResponses, 
  addResponse, 
  updateResponse, 
  deleteResponse 
} from './cannedResponsesCore';
import { mockCannedResponses } from '@/mock/cannedResponses';

// In a real app, these would make API calls to your backend
export const fetchCannedResponses = createAsyncThunk(
  'cannedResponses/fetchAll',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // Simulating API call with mock data
      const responses = mockCannedResponses;
      dispatch(setResponses(responses));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch canned responses'));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createCannedResponse = createAsyncThunk(
  'cannedResponses/create',
  async (response: Omit<CannedResponse, 'id' | 'createdAt' | 'updatedAt'>, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // Simulating API call
      const newResponse: CannedResponse = {
        ...response,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addResponse(newResponse));
      dispatch(setError(null));
      return newResponse;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to create canned response'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const updateCannedResponse = createAsyncThunk(
  'cannedResponses/update',
  async (response: CannedResponse, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // Simulating API call
      const updatedResponse = {
        ...response,
        updatedAt: new Date().toISOString(),
      };
      dispatch(updateResponse(updatedResponse));
      dispatch(setError(null));
      return updatedResponse;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to update canned response'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const deleteCannedResponse = createAsyncThunk(
  'cannedResponses/delete',
  async (id: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // Simulating API call
      dispatch(deleteResponse(id));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to delete canned response'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
