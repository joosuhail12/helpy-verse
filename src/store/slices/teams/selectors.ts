
import { RootState } from '@/store';

export const selectAllTeams = (state: RootState) => state.teams.teams;
export const selectTeamsLoading = (state: RootState) => state.teams.loading;
export const selectTeamsError = (state: RootState) => state.teams.error;
export const selectTeamDetails = (state: RootState) => state.teams.teamDetails;
export const selectAreTeamsLoaded = (state: RootState) => state.teams.areTeamsLoaded;
