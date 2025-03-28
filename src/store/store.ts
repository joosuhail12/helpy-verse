
import { configureStore } from '@reduxjs/toolkit';
import { actionsReducer } from './slices/actions/actionsSlice';
import contentReducer from './slices/content/contentSlice';
import contentCenterReducer from './slices/automation/contentCenterSlice';
import contactsReducer from './slices/contacts/contactsSlice';
import companiesReducer from './slices/companies/companiesSlice';
import inboxReducer from './slices/inbox/inboxSlice';
import tagsReducer from './slices/tags/tagsSlice';
import { teammatesReducer } from './slices/teammates/teammatesSlice';
import teamsReducer from './slices/teams/teamsSlice';
import { emailChannelsReducer } from './slices/emailChannels/emailChannelsSlice';
import { cannedResponsesReducer } from './slices/cannedResponses/cannedResponsesSlice';
import { chatbotsReducer } from './slices/chatbots/chatbotsSlice';
import userReducer from './slices/user/userSlice';
import { securityReducer } from './slices/securitySlice';
import legacyContactsReducer from './slices/contactSlice';
import authReducer from './slices/auth/authSlice';

// Define the root reducer with all slices
const rootReducer = {
  auth: authReducer,
  actions: actionsReducer,
  content: contentReducer,
  contentCenter: contentCenterReducer,
  contacts: contactsReducer,
  legacyContacts: legacyContactsReducer, // Keep for backward compatibility
  companies: companiesReducer,
  inbox: inboxReducer,
  tags: tagsReducer,
  teammates: teammatesReducer,
  teams: teamsReducer,
  emailChannels: emailChannelsReducer,
  cannedResponses: cannedResponsesReducer,
  chatbots: chatbotsReducer,
  user: userReducer,
  security: securityReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
