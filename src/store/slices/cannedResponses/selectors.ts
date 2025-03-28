
import { RootState } from '../../store';
import { createSelector } from '@reduxjs/toolkit';

// Base selector to get the cannedResponses slice
const selectCannedResponsesState = (state: RootState) => state.cannedResponses;

// Derived selectors
export const selectCannedResponses = createSelector(
  [selectCannedResponsesState],
  (cannedResponsesState) => cannedResponsesState.responses
);

export const selectCannedResponsesLoading = createSelector(
  [selectCannedResponsesState],
  (cannedResponsesState) => cannedResponsesState.loading
);

export const selectCannedResponsesError = createSelector(
  [selectCannedResponsesState],
  (cannedResponsesState) => cannedResponsesState.error
);

export const selectSelectedCannedResponse = createSelector(
  [selectCannedResponsesState],
  (cannedResponsesState) => cannedResponsesState.selectedResponse
);

export const selectCannedResponseById = createSelector(
  [selectCannedResponses, (_, id: string) => id],
  (responses, id) => responses.find(response => response.id === id) || null
);
