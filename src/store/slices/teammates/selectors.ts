
import { RootState } from '@/store/store';

// Ensure we always return an array, even if teammates are undefined
export const selectAllTeammates = (state: RootState) => {
  return state.teammates?.teammates || [];
};

export const selectTeammatesLoading = (state: RootState) => 
  state.teammates?.loading || false;

export const selectTeammatesError = (state: RootState) => 
  state.teammates?.error || null;

export const selectTeammateById = (state: RootState, teammateId: string) => 
  state.teammates?.teammates?.find(teammate => teammate.id === teammateId) || null;

export const selectTeammateDetails = (state: RootState) => 
  state.teammates?.selectedTeammate || null;

export const selectTeammateActivities = (state: RootState, teammateId: string) => 
  state.teammates?.activities[teammateId] || [];

export const selectTeammateAssignments = (state: RootState, teammateId: string) => 
  state.teammates?.assignments[teammateId] || [];

export const selectTeammateSessions = (state: RootState, teammateId: string) => 
  state.teammates?.sessions[teammateId] || [];
