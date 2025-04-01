
import { createAction } from '@reduxjs/toolkit';

// Invitation actions
export const resendInvitation = createAction<string>('teammates/resendInvitation');
