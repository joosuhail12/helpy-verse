
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { CustomAction, ActionParameter } from '@/types/action';

export type ActionsState = {
  actions: CustomAction[];
  loading: boolean;
  error: string | null;
  items: CustomAction[]; // Used by some components
};

const initialState: ActionsState = {
  actions: [],
  items: [], // Initialize items array
  loading: false,
  error: null,
};

// Async thunks
export const fetchActions = createAsyncThunk(
  'actions/fetchActions',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/actions');
      if (!response.ok) {
        throw new Error('Failed to fetch actions');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAction = createAsyncThunk(
  'actions/addAction',
  async (action: Omit<CustomAction, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      });
      if (!response.ok) {
        throw new Error('Failed to add action');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAction = createAsyncThunk(
  'actions/updateAction',
  async ({ id, updates }: { id: string; updates: Partial<CustomAction> }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/actions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update action');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch actions
      .addCase(fetchActions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActions.fulfilled, (state, action) => {
        state.loading = false;
        state.actions = action.payload;
        state.items = action.payload; // Update items as well
      })
      .addCase(fetchActions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add action
      .addCase(addAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAction.fulfilled, (state, action) => {
        state.loading = false;
        state.actions.push(action.payload);
        state.items.push(action.payload); // Add to items as well
      })
      .addCase(addAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update action
      .addCase(updateAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.actions.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.actions[index] = action.payload;
        }
        const itemIndex = state.items.findIndex(a => a.id === action.payload.id);
        if (itemIndex !== -1) {
          state.items[itemIndex] = action.payload;
        }
      })
      .addCase(updateAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectActions = (state: RootState) => state.actions.actions;
export const selectActionsLoading = (state: RootState) => state.actions.loading;
export const selectActionsError = (state: RootState) => state.actions.error;

export const actionsReducer = actionsSlice.reducer;
