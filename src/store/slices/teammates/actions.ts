
import { createAction } from '@reduxjs/toolkit';
import type { Teammate, ActivityLog, TeamAssignment } from '@/types/teammate';
import type { Session } from '@/types/teammate';

// Teammate actions
export const fetchTeammateAssignments = createAction<string>('teammates/fetchTeammateAssignments');
export const fetchTeammateSessions = createAction<string>('teammates/fetchTeammateSessions');
export const terminateSession = createAction<{ teammateId: string, sessionId: string }>('teammates/terminateSession');
export const resetPassword = createAction<string>('teammates/resetPassword');
export const enable2FA = createAction<string>('teammates/enable2FA');
export const verify2FA = createAction<{ teammateId: string, code: string }>('teammates/verify2FA');
export const disable2FA = createAction<string>('teammates/disable2FA');
export const updateTeammate = createAction<Teammate>('teammates/updateTeammate');
export const resendInvitation = createAction<string>('teammates/resendInvitation');
export const setTeammateActivities = createAction<ActivityLog[]>('teammates/setTeammateActivities');
export const setTeammateAssignments = createAction<TeamAssignment[]>('teammates/setTeammateAssignments');
export const setTeammateSessions = createAction<Session[]>('teammates/setTeammateSessions');
