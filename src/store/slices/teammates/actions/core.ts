
import { createAction } from '@reduxjs/toolkit';
import type { Teammate } from '@/types/teammate';

// Core teammate actions
export const addTeammate = createAction<Teammate>('teammates/addTeammate');
export const updateTeammate = createAction<Teammate>('teammates/updateTeammate');
export const updateTeammatesRole = createAction<{teammateIds: string[], role: string}>('teammates/updateTeammatesRole');
export const updateTeammatePermissions = createAction<{id: string, permissions: string[]}>('teammates/updateTeammatePermissions');
export const fetchTeammateDetails = createAction<string>('teammates/fetchTeammateDetails');
export const fetchTeammates = createAction('teammates/fetchTeammates');
export const fetchTeammateActivities = createAction<string>('teammates/fetchTeammateActivities');
export const fetchTeammateAssignments = createAction<string>('teammates/fetchTeammateAssignments');
