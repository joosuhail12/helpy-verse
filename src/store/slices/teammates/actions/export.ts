
import { createAction } from '@reduxjs/toolkit';

// Export actions
export const exportTeammates = createAction<{format?: string} | string[]>('teammates/exportTeammates');
