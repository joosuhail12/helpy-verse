
import { RootState } from '@/store/store';
import type { Teammate } from '@/types/teammate';

export const selectAllTeammates = (state: RootState): Teammate[] => state.teammates.teammates;
export const selectTeammatesLoading = (state: RootState): boolean => state.teammates.loading;
export const selectTeammatesError = (state: RootState): string | null => state.teammates.error;
export const selectSelectedTeammate = (state: RootState): Teammate | null => state.teammates.selectedTeammate;
export const selectTeammateActivities = (state: RootState, teammateId: string) => 
  state.teammates.activities[teammateId] || [];
export const selectTeammateAssignments = (state: RootState, teammateId: string) => 
  state.teammates.assignments[teammateId] || [];
export const selectTeammateSessions = (state: RootState, teammateId: string) => 
  state.teammates.sessions[teammateId] || [];
export const selectTeammateById = (state: RootState, teammateId: string) => 
  state.teammates.teammates.find(teammate => teammate.id === teammateId);
