import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/user/userSlice';
import contactsReducer from './slices/contacts/contactsSlice';
import tagsReducer from './slices/settings/tags/tagsSlice';
import teamsReducer from './slices/settings/teams/teamsSlice';
import teammatesReducer from './slices/settings/teammates/teammatesSlice';
import customDataReducer from './slices/settings/customData/customDataSlice';
import cannedResponsesReducer from './slices/settings/cannedResponses/cannedResponsesSlice';
import emailDomainsReducer from './slices/settings/email/domains/emailDomainsSlice';
import emailChannelsReducer from './slices/settings/email/channels/emailChannelsSlice';
import companiesReducer from './slices/contacts/companiesSlice';
import contentCenterReducer from './slices/automation/contentCenterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    contacts: contactsReducer,
    tags: tagsReducer,
    teams: teamsReducer,
    teammates: teammatesReducer,
    customData: customDataReducer,
    cannedResponses: cannedResponsesReducer,
    emailDomains: emailDomainsReducer,
    emailChannels: emailChannelsReducer,
    companies: companiesReducer,
    contentCenter: contentCenterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
