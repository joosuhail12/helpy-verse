
import { RootState } from '@/store/store';
import type { Team } from '@/types/team';

export const selectAllTeams = (state: RootState): Team[] => state.teams.teams;
export const selectTeamById = (id: string) => (state: RootState): Team | undefined => 
  state.teams.teams.find(team => team.id === id);
export const selectTeamDetails = (state: RootState): Team | null => state.teams.teamDetails;
export const selectTeamsLoading = (state: RootState): boolean => state.teams.loading;
export const selectTeamsError = (state: RootState): string | null => state.teams.error;
export const selectAreTeamsLoaded = (state: RootState): boolean => state.teams.areTeamsLoaded;
