
import { configureStore } from '@reduxjs/toolkit';

// Slices
import authReducer from './slices/auth/authSlice';
import tagsReducer from './slices/tagsSlice';
import ticketsReducer from './slices/tickets/ticketsSlice';

// Import other reducers as needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tags: tagsReducer,
    tickets: ticketsReducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
