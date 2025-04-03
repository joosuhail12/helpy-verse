import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/user/userSlice';
import teamsReducer from './slices/teams/teamsSlice';
// Import other reducers as needed

// Create a root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  teams: teamsReducer,
  // Add other reducers here
});

// Configure the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types (often used for non-serializable data)
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
