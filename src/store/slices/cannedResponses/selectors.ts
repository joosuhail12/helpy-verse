
import { RootState } from '../../store';
import { createSelector } from '@reduxjs/toolkit';
import { selectAllCannedResponses, selectCannedResponseById } from './cannedResponsesSlice';

// Base selector to get the cannedResponses slice
const selectCannedResponsesState = (state: RootState) => state.cannedResponses;

// Derived selectors
export const selectCannedResponses = createSelector(
  [selectCannedResponsesState],
  (state) => selectAllCannedResponses(state)
);

export const selectCannedResponsesLoading = createSelector(
  [selectCannedResponsesState],
  (state) => state.loading
);

export const selectCannedResponsesError = createSelector(
  [selectCannedResponsesState],
  (state) => state.error
);

export const selectSelectedCannedResponseId = createSelector(
  [selectCannedResponsesState],
  (state) => state.selectedResponseId
);

export const selectSelectedCannedResponse = createSelector(
  [selectCannedResponsesState, selectSelectedCannedResponseId],
  (state, selectedId) => {
    if (!selectedId) return null;
    return selectCannedResponseById(state, selectedId);
  }
);

export const selectCannedResponseByIdSelector = (id: string) => 
  createSelector(
    [selectCannedResponsesState],
    (state) => selectCannedResponseById(state, id)
  );
