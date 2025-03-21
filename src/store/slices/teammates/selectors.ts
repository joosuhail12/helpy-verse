
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { Teammate } from '@/types/teammate';

// Basic selectors
export const selectTeammatesState = (state: RootState) => state.teammates;

export const selectAllTeammates = (state: RootState) => state.teammates.teammates;

export const selectTeammatesLoading = (state: RootState) => state.teammates.loading;

export const selectTeammatesError = (state: RootState) => state.teammates.error;

export const selectSelectedTeammate = (state: RootState) => state.teammates.selectedTeammate;

// Derived selectors
export const selectTeammateById = createSelector(
  [selectAllTeammates, (_, teammateId: string) => teammateId],
  (teammates, teammateId) => teammates.find(teammate => teammate.id === teammateId)
);

export const selectTeammateActivities = createSelector(
  [(state: RootState) => state.teammates.activities, (_, teammateId: string) => teammateId],
  (activities, teammateId) => activities[teammateId] || []
);

export const selectTeammateAssignments = createSelector(
  [(state: RootState) => state.teammates.assignments, (_, teammateId: string) => teammateId],
  (assignments, teammateId) => assignments[teammateId] || []
);

export const selectTeammateSessions = createSelector(
  [(state: RootState) => state.teammates.sessions, (_, teammateId: string) => teammateId],
  (sessions, teammateId) => sessions[teammateId] || []
);

export const selectActiveTeammates = createSelector(
  [selectAllTeammates],
  (teammates) => teammates.filter(teammate => teammate.status === 'active')
);

export const selectInactiveTeammates = createSelector(
  [selectAllTeammates],
  (teammates) => teammates.filter(teammate => teammate.status === 'inactive')
);

export const selectTeammatesByRole = createSelector(
  [selectAllTeammates, (_, role: Teammate['role']) => role],
  (teammates, role) => teammates.filter(teammate => teammate.role === role)
);
