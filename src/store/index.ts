
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import teamsReducer from './slices/teams/teamsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams: teamsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['some-non-serializable-action'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
