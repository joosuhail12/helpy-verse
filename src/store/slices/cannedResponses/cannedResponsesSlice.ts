
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { CannedResponse } from '@/mock/cannedResponses';

export type CannedResponsesState = {
  responses: CannedResponse[];
  selectedResponse: CannedResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: CannedResponsesState = {
  responses: [],
  selectedResponse: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCannedResponses = createAsyncThunk(
  'cannedResponses/fetchCannedResponses',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/canned-responses');
      if (!response.ok) {
        throw new Error('Failed to fetch canned responses');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCannedResponse = createAsyncThunk(
  'cannedResponses/createCannedResponse',
  async (responseData: Omit<CannedResponse, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/canned-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData),
      });
      if (!response.ok) {
        throw new Error('Failed to create canned response');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCannedResponse = createAsyncThunk(
  'cannedResponses/updateCannedResponse',
  async (responseData: CannedResponse, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/canned-responses/${responseData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData),
      });
      if (!response.ok) {
        throw new Error('Failed to update canned response');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCannedResponse = createAsyncThunk(
  'cannedResponses/deleteCannedResponse',
  async (id: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/canned-responses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete canned response');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const cannedResponsesSlice = createSlice({
  name: 'cannedResponses',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setResponses: (state, action: PayloadAction<CannedResponse[]>) => {
      state.responses = action.payload;
    },
    addResponse: (state, action: PayloadAction<CannedResponse>) => {
      state.responses.push(action.payload);
    },
    updateResponse: (state, action: PayloadAction<CannedResponse>) => {
      const index = state.responses.findIndex(response => response.id === action.payload.id);
      if (index !== -1) {
        state.responses[index] = action.payload;
      }
    },
    deleteResponse: (state, action: PayloadAction<string>) => {
      state.responses = state.responses.filter(response => response.id !== action.payload);
    },
    selectResponse: (state, action: PayloadAction<string>) => {
      state.selectedResponse = state.responses.find(response => response.id === action.payload) || null;
    },
    clearSelectedResponse: (state) => {
      state.selectedResponse = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch canned responses
      .addCase(fetchCannedResponses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCannedResponses.fulfilled, (state, action) => {
        state.loading = false;
        state.responses = action.payload;
      })
      .addCase(fetchCannedResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create canned response
      .addCase(createCannedResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCannedResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.responses.push(action.payload);
      })
      .addCase(createCannedResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update canned response
      .addCase(updateCannedResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCannedResponse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.responses.findIndex(response => response.id === action.payload.id);
        if (index !== -1) {
          state.responses[index] = action.payload;
        }
        if (state.selectedResponse?.id === action.payload.id) {
          state.selectedResponse = action.payload;
        }
      })
      .addCase(updateCannedResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete canned response
      .addCase(deleteCannedResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCannedResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.responses = state.responses.filter(response => response.id !== action.payload);
        if (state.selectedResponse?.id === action.payload) {
          state.selectedResponse = null;
        }
      })
      .addCase(deleteCannedResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  setError,
  setResponses,
  addResponse,
  updateResponse,
  deleteResponse,
  selectResponse,
  clearSelectedResponse,
} = cannedResponsesSlice.actions;

export const cannedResponsesReducer = cannedResponsesSlice.reducer;
