
import { createAction } from '@reduxjs/toolkit';

// Export actions
export const exportTeammates = createAction<{format?: string}>('teammates/exportTeammates');
