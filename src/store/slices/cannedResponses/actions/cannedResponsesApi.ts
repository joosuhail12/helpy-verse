
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CannedResponse } from '@/mock/cannedResponses';

// Mock API call function with delay to simulate server request
const mockApiCall = async (delay: number) => {
  return new Promise<void>(resolve => setTimeout(resolve, delay));
};

// Fetch all canned responses
export const fetchCannedResponses = createAsyncThunk(
  'cannedResponses/fetchCannedResponses',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call latency
      await mockApiCall(500);
      
      // For now, return mock data from @/mock/cannedResponses
      // In a real app, this would be a fetch call to the backend
      const mockResponses: CannedResponse[] = []; // Add mock data or import from mock
      
      return mockResponses;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch canned responses');
    }
  }
);

// Fetch a specific canned response by ID
export const fetchCannedResponseById = createAsyncThunk(
  'cannedResponses/fetchCannedResponseById',
  async (id: string, { rejectWithValue }) => {
    try {
      // Simulate API call latency
      await mockApiCall(300);
      
      // For now, return mock data
      // In a real app, this would be a fetch call to the backend
      const mockResponse: CannedResponse = { 
        id,
        title: 'Mock Response',
        content: 'This is a mock response',
        shortcut: 'mock',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user-1',
        updatedBy: 'user-1',
        team: 'team-1',
        category: 'general',
        usageCount: 0,
        isArchived: false,
        versions: []
      };
      
      return mockResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch canned response');
    }
  }
);

// Create a new canned response
export const createCannedResponse = createAsyncThunk(
  'cannedResponses/createCannedResponse',
  async (response: Omit<CannedResponse, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Simulate API call latency
      await mockApiCall(600);
      
      // Generate a new ID and timestamps for the mock response
      const newResponse: CannedResponse = {
        ...response,
        id: `canned-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        isArchived: false,
        versions: []
      };
      
      return newResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create canned response');
    }
  }
);

// Update an existing canned response
export const updateCannedResponse = createAsyncThunk(
  'cannedResponses/updateCannedResponse',
  async (
    { id, updates }: { id: string; updates: Partial<CannedResponse> }, 
    { rejectWithValue }
  ) => {
    try {
      // Simulate API call latency
      await mockApiCall(500);
      
      // In a real app, this would send updates to the server
      // For mock, we just return the updated response
      const updatedResponse: CannedResponse = {
        ...(updates as CannedResponse),
        id,
        updatedAt: new Date().toISOString()
      };
      
      return updatedResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update canned response');
    }
  }
);

// Delete a canned response
export const deleteCannedResponse = createAsyncThunk(
  'cannedResponses/deleteCannedResponse',
  async (id: string, { rejectWithValue }) => {
    try {
      // Simulate API call latency
      await mockApiCall(400);
      
      // In a real app, this would send a delete request to the server
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete canned response');
    }
  }
);
