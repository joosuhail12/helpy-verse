
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import contactsReducer from './slices/contacts/contactsSlice';
import contentReducer from './slices/content/contentSlice';
import emailChannelsReducer from './slices/emailChannels/emailChannelsSlice';
import securityReducer from './slices/securitySlice';
import tagsReducer from './slices/tagsSlice';
import teammatesReducer from './slices/teammates/teammatesSlice';
import teamsReducer from './slices/teams/teamsSlice';
import actionsReducer from './slices/actions/actionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contacts: contactsReducer,
    content: contentReducer,
    emailChannels: emailChannelsReducer,
    security: securityReducer,
    tags: tagsReducer,
    teammates: teammatesReducer,
    teams: teamsReducer,
    actions: actionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
