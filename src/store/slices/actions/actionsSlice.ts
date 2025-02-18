
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CustomAction } from '@/types/action';

interface ActionsState {
  items: CustomAction[];
}

const initialState: ActionsState = {
  items: [
    {
      id: "1", // Changed to string to match route parameter
      name: 'Get User Profile',
      toolName: 'User Management API',
      description: 'Fetches user profile information from the API',
      endpoint: 'https://api.example.com/users/{userId}',
      method: 'GET',
      parameters: [
        {
          id: '1',
          name: 'userId',
          type: 'string',
          description: 'The unique identifier of the user',
          required: true,
        }
      ],
      headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json'
      },
      createdAt: '2024-03-15T10:00:00Z',
      updatedAt: '2024-03-15T10:00:00Z',
      createdBy: {
        id: '1',
        name: 'System Admin',
      },
      enabled: true,
    },
    {
      id: '2',
      name: 'Update Email Preferences',
      toolName: 'User Management API',
      description: 'Updates user email notification preferences',
      endpoint: 'https://api.example.com/users/{userId}/preferences',
      method: 'PATCH',
      parameters: [
        {
          id: '2',
          name: 'userId',
          type: 'string',
          description: 'The unique identifier of the user',
          required: true,
        },
        {
          id: '3',
          name: 'preferences',
          type: 'object',
          description: 'Email notification preferences object',
          required: true,
        }
      ],
      headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json'
      },
      createdAt: '2024-03-15T11:00:00Z',
      updatedAt: '2024-03-15T11:00:00Z',
      createdBy: {
        id: '1',
        name: 'System Admin',
      },
      enabled: true,
    },
    {
      id: '3',
      name: 'Delete Account',
      toolName: 'User Management API',
      description: 'Permanently deletes a user account',
      endpoint: 'https://api.example.com/users/{userId}',
      method: 'DELETE',
      parameters: [
        {
          id: '4',
          name: 'userId',
          type: 'string',
          description: 'The unique identifier of the user to delete',
          required: true,
        }
      ],
      headers: {
        'Authorization': 'Bearer {token}',
      },
      createdAt: '2024-03-15T12:00:00Z',
      updatedAt: '2024-03-15T12:00:00Z',
      createdBy: {
        id: '1',
        name: 'System Admin',
      },
      enabled: false,
    }
  ],
};

const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
    addAction: (state, action: PayloadAction<CustomAction>) => {
      state.items.push(action.payload);
    },
    updateAction: (state, action: PayloadAction<CustomAction>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteAction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    toggleAction: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.items[index].enabled = !state.items[index].enabled;
      }
    },
  },
});

export const { addAction, updateAction, deleteAction, toggleAction } = actionsSlice.actions;
export default actionsSlice.reducer;

