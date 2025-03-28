
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// Base selector
const getCannedResponsesState = (state: RootState) => state.cannedResponses;

// Memoized selectors
export const selectCannedResponses = createSelector(
  [getCannedResponsesState],
  (state) => state?.responses || []
);

export const selectCannedResponsesLoading = createSelector(
  [getCannedResponsesState],
  (state) => state?.loading || false
);

export const selectCannedResponsesError = createSelector(
  [getCannedResponsesState],
  (state) => state?.error || null
);

export const selectSelectedCannedResponse = createSelector(
  [getCannedResponsesState],
  (state) => state?.selectedResponse || null
);

export const selectCannedResponseById = createSelector(
  [selectCannedResponses, (_, id: string) => id],
  (responses, id) => responses.find(response => response.id === id) || null
);
