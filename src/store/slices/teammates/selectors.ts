
import { RootState } from '@/store/store';
import type { Teammate } from '@/types/teammate';

export const selectAllTeammates = (state: RootState): Teammate[] => state.teammates.teammates;
export const selectTeammatesLoading = (state: RootState): boolean => state.teammates.loading;
export const selectTeammatesError = (state: RootState): string | null => state.teammates.error;
