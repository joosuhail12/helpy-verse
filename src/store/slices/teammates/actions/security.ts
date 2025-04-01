
import { createAction } from '@reduxjs/toolkit';

// Security-related actions
export const enable2FA = createAction<string>('teammates/enable2FA');
export const verify2FA = createAction<{teammateId: string, code: string}>('teammates/verify2FA');
export const disable2FA = createAction<string>('teammates/disable2FA');
export const resetPassword = createAction<{teammateId: string, newPassword: string}>('teammates/resetPassword');
export const fetchTeammateSessions = createAction<string>('teammates/fetchTeammateSessions');
export const terminateSession = createAction<{teammateId: string, sessionId: string}>('teammates/terminateSession');
