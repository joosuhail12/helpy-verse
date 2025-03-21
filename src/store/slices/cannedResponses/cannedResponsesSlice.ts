
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CannedResponse } from '@/mock/cannedResponses';
import type { CannedResponsesState } from './types';
import { mockCannedResponses } from '@/mock/cannedResponses';

const initialState: CannedResponsesState = {
  responses: mockCannedResponses,
  loading: false,
  error: null,
  selectedResponse: null,
  versionHistory: null,
  categories: Array.from(new Set(mockCannedResponses.map(r => r.category))),
};

export const cannedResponsesSlice = createSlice({
  name: 'cannedResponses',
  initialState,
  reducers: {
    setResponses: (state, action: PayloadAction<CannedResponse[]>) => {
      state.responses = action.payload;
    },
    addResponse: (state, action: PayloadAction<CannedResponse>) => {
      state.responses.push(action.payload);
    },
    updateResponse: (state, action: PayloadAction<CannedResponse>) => {
      const index = state.responses.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        // Create a new version before updating
        const oldResponse = state.responses[index];
        const changes = [];
        if (oldResponse.title !== action.payload.title) {
          changes.push({
            field: 'title',
            oldValue: oldResponse.title,
            newValue: action.payload.title,
          });
        }
        if (oldResponse.content !== action.payload.content) {
          changes.push({
            field: 'content',
            oldValue: oldResponse.content,
            newValue: action.payload.content,
          });
        }

        const newVersion = {
          id: Date.now().toString(),
          responseId: oldResponse.id,
          title: oldResponse.title,
          content: oldResponse.content,
          createdBy: oldResponse.createdBy,
          createdAt: new Date().toISOString(),
          changes,
        };

        state.responses[index] = {
          ...action.payload,
          versions: [...(oldResponse.versions || []), newVersion],
        };
      }
    },
    deleteResponse: (state, action: PayloadAction<string>) => {
      state.responses = state.responses.filter(r => r.id !== action.payload);
    },
    setSelectedResponse: (state, action: PayloadAction<CannedResponse | null>) => {
      state.selectedResponse = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setVersionHistory: (state, action: PayloadAction<{ responseId: string; versions: CannedResponse['versions'] } | null>) => {
      state.versionHistory = action.payload;
    },
    incrementUsage: (state, action: PayloadAction<{ responseId: string; userId: string; userName: string }>) => {
      const response = state.responses.find(r => r.id === action.payload.responseId);
      if (response) {
        if (!response.usageStats) {
          response.usageStats = {
            totalUses: 0,
            lastUsed: new Date().toISOString(),
            usedBy: [],
          };
        }
        response.usageStats.totalUses += 1;
        response.usageStats.lastUsed = new Date().toISOString();
        const userStat = response.usageStats.usedBy.find(u => u.userId === action.payload.userId);
        if (userStat) {
          userStat.useCount += 1;
        } else {
          response.usageStats.usedBy.push({
            userId: action.payload.userId,
            userName: action.payload.userName,
            useCount: 1,
          });
        }
      }
    },
  },
});

export const {
  setResponses,
  addResponse,
  updateResponse,
  deleteResponse,
  setSelectedResponse,
  setLoading,
  setError,
  setVersionHistory,
  incrementUsage,
} = cannedResponsesSlice.actions;

export default cannedResponsesSlice.reducer;
