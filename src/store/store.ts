
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tagsReducer from './slices/tagsSlice';
import teammatesReducer from './slices/teammatesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tags: tagsReducer,
    teammates: teammatesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
