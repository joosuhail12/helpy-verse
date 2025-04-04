
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import type { Team } from '@/types/team';

// Base selector
const getTeamsState = (state: RootState) => state.teams;

// Memoized selectors
export const selectAllTeams = createSelector(
  [getTeamsState],
  (state): Team[] => state.teams
);

export const selectTeamById = (id: string) => createSelector(
  [selectAllTeams],
  (teams): Team | undefined => teams.find(team => team.id === id)
);

export const selectTeamDetails = createSelector(
  [getTeamsState],
  (state): Team | null => state.teamDetails
);

export const selectTeamsLoading = createSelector(
  [getTeamsState],
  (state): boolean => state.loading
);

export const selectTeamsError = createSelector(
  [getTeamsState],
  (state): string | null => state.error
);

export const selectAreTeamsLoaded = createSelector(
  [getTeamsState],
  (state): boolean => state.areTeamsLoaded
);
