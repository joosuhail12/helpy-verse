
import { RootState } from '@/store/store';
import { Team } from './teamsSlice';

export const selectAllTeams = (state: RootState): Team[] => state.teams.teams;
export const selectTeamsLoading = (state: RootState): boolean => state.teams.loading;
export const selectTeamsError = (state: RootState): string | null => state.teams.error;
