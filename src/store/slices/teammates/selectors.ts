
import { RootState } from '@/store/store';

// Ensure we always return an array, even if teammates are undefined
export const selectAllTeammates = (state: RootState) => {
  if (!state.teammates || !state.teammates.teammates) {
    console.warn('Teammates state is undefined or null');
    return [];
  }
  return state.teammates.teammates;
};

export const selectTeammatesLoading = (state: RootState) => {
  if (!state.teammates) {
    return false;
  }
  return state.teammates.loading || false;
};

export const selectTeammatesError = (state: RootState) => {
  if (!state.teammates) {
    return null;
  }
  return state.teammates.error || null;
};

export const selectTeammateById = (state: RootState, teammateId: string) => {
  if (!state.teammates || !state.teammates.teammates) {
    return null;
  }
  return state.teammates.teammates.find(teammate => teammate.id === teammateId) || null;
};

export const selectTeammateDetails = (state: RootState) => {
  if (!state.teammates) {
    return null;
  }
  return state.teammates.selectedTeammate || null;
};

export const selectTeammateActivities = (state: RootState, teammateId: string) => {
  if (!state.teammates || !state.teammates.activities) {
    return [];
  }
  return state.teammates.activities[teammateId] || [];
};

export const selectTeammateAssignments = (state: RootState, teammateId: string) => {
  if (!state.teammates || !state.teammates.assignments) {
    return [];
  }
  return state.teammates.assignments[teammateId] || [];
};

export const selectTeammateSessions = (state: RootState, teammateId: string) => {
  if (!state.teammates || !state.teammates.sessions) {
    return [];
  }
  return state.teammates.sessions[teammateId] || [];
};
