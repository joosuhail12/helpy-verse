
import { createAction } from '@reduxjs/toolkit';
import type { Team } from '@/types/team';

export const setLoading = createAction<boolean>('teams/setLoading');
export const setError = createAction<string | null>('teams/setError');
export const setTeams = createAction<Team[]>('teams/setTeams');

// Export other actions as needed
