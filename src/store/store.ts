
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tagsReducer from './slices/tagsSlice';
import teammatesReducer from './slices/teammates/teammatesSlice';
import securityReducer from './slices/securitySlice';
import teamsReducer from './slices/teams/teamsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tags: tagsReducer,
    teammates: teammatesReducer,
    security: securityReducer,
    teams: teamsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
