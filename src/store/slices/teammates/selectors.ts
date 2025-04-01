
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';

// Basic selectors
export const selectTeammatesState = (state: RootState) => state.teammates;
export const selectAllTeammates = (state: RootState) => state.teammates.teammates;
export const selectTeammateDetails = (state: RootState) => state.teammates.selectedTeammate;
export const selectTeammatesLoading = (state: RootState) => state.teammates.loading;
export const selectTeammatesError = (state: RootState) => state.teammates.error;
export const selectTeammateDetailsLoading = (state: RootState) => state.teammates.loading;
export const selectTeammateActivities = (state: RootState, teammateId: string) => 
  state.teammates.activities[teammateId] || [];

// Memoized selectors
export const selectTeammateById = createSelector(
  [selectAllTeammates, (state: RootState, teammateId: string) => teammateId],
  (teammates, teammateId) => teammates.find(teammate => teammate.id === teammateId) || null
);

export const selectActiveTeammates = createSelector(
  [selectAllTeammates],
  (teammates) => teammates.filter(teammate => teammate.status === 'active')
);

export const selectPendingTeammates = createSelector(
  [selectAllTeammates],
  (teammates) => teammates.filter(teammate => teammate.status === 'pending')
);

export const selectTeammatesByTeam = createSelector(
  [selectAllTeammates, (state: RootState, teamId: string) => teamId],
  (teammates, teamId) => teammates.filter(teammate => teammate.team === teamId)
);

export const selectTeammateAssignments = createSelector(
  [
    (state: RootState) => state.teammates.assignments,
    (state: RootState, teammateId: string) => teammateId
  ],
  (assignments, teammateId) => assignments[teammateId] || []
);

export const selectTeammateSessions = createSelector(
  [
    (state: RootState) => state.teammates.sessions,
    (state: RootState, teammateId: string) => teammateId
  ],
  (sessions, teammateId) => sessions[teammateId] || []
);

export const selectTeammateLastFetchTime = (state: RootState) => state.teammates.lastFetchTime;
export const selectTeammateRetryCount = (state: RootState) => state.teammates.retryCount;
