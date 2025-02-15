import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tagsReducer from './slices/tagsSlice';
import teammatesReducer from './slices/teammates/teammatesSlice';
import securityReducer from './slices/securitySlice';
import teamsReducer from './slices/teams/teamsSlice';
import cannedResponsesReducer from './slices/cannedResponses/cannedResponsesSlice';
import emailChannelsReducer from './slices/emailChannels/emailChannelsSlice';
import contactsReducer from './slices/contacts/contactsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tags: tagsReducer,
    teammates: teammatesReducer,
    security: securityReducer,
    teams: teamsReducer,
    cannedResponses: cannedResponsesReducer,
    emailChannels: emailChannelsReducer,
    contacts: contactsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
