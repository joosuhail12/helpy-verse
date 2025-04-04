
import { RootState } from '@/store/store';
import { createSelector } from '@reduxjs/toolkit';

// Basic selectors
const getTeammatesState = (state: RootState) => state.teammates;
const getTeammates = (state: RootState) => state.teammates.teammates || [];
const getTeammateIds = createSelector(
  [getTeammates],
  (teammates) => teammates.map(teammate => teammate.id)
);

// Memoized selectors
export const selectAllTeammates = createSelector(
  [getTeammates],
  (teammates) => teammates
);

export const selectTeammatesLoading = createSelector(
  [getTeammatesState],
  (teammatesState) => teammatesState?.loading || false
);

export const selectTeammatesError = createSelector(
  [getTeammatesState],
  (teammatesState) => {
    if (!teammatesState) return null;
    
    // If error is a string, return it directly
    if (typeof teammatesState.error === 'string') {
      return teammatesState.error;
    }
    
    // If error is an object with a message property, return the message
    if (teammatesState.error && typeof teammatesState.error === 'object' && 'message' in teammatesState.error) {
      return (teammatesState.error as Error).message || JSON.stringify(teammatesState.error);
    }
    
    return teammatesState.error || null;
  }
);

export const selectTeammateById = createSelector(
  [getTeammates, (state, teammateId: string) => teammateId],
  (teammates, teammateId) => teammates.find(teammate => teammate.id === teammateId) || null
);

export const selectTeammateDetailsLoading = createSelector(
  [getTeammatesState],
  (teammatesState) => teammatesState?.loading || false
);

export const selectTeammateDetails = createSelector(
  [getTeammatesState],
  (teammatesState) => teammatesState?.selectedTeammate || null
);

export const selectTeammateActivities = createSelector(
  [getTeammatesState, (state, teammateId: string) => teammateId],
  (teammatesState, teammateId) => teammatesState?.activities[teammateId] || []
);

export const selectTeammateAssignments = createSelector(
  [getTeammatesState, (state, teammateId: string) => teammateId],
  (teammatesState, teammateId) => teammatesState?.assignments[teammateId] || []
);

export const selectTeammateSessions = createSelector(
  [getTeammatesState, (state, teammateId: string) => teammateId],
  (teammatesState, teammateId) => teammatesState?.sessions[teammateId] || []
);
