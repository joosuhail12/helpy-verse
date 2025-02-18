import { configureStore } from '@reduxjs/toolkit';
import actionsReducer from './slices/actions/actionsSlice';
import chatbotsReducer from './slices/chatbots/chatbotsSlice';
import contentReducer from './slices/content/contentSlice';

export const store = configureStore({
  reducer: {
    actions: actionsReducer,
    chatbots: chatbotsReducer,
    content: contentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
