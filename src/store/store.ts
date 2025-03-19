
import { configureStore } from '@reduxjs/toolkit';

// Slices
import authReducer from './slices/auth/authSlice';
import tagsReducer from './slices/tagsSlice';
import ticketsReducer from './slices/tickets/ticketsSlice';
import contentReducer from './slices/content/contentSlice';
import contactsReducer from './slices/contacts/contactsSlice';
import companiesReducer from './slices/companies/companiesSlice';
import actionsReducer from './slices/actions/actionsSlice';
import chatbotsReducer from './slices/chatbots/chatbotsSlice';
import contentCenterReducer from './slices/automation/contentCenterSlice';
import cannedResponsesReducer from './slices/cannedResponses/cannedResponsesSlice';
import emailChannelsReducer from './slices/emailChannels/emailChannelsSlice';
import teamsReducer from './slices/teams/teamsSlice';
import teammatesReducer from './slices/teammates/teammatesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tags: tagsReducer,
    tickets: ticketsReducer,
    content: contentReducer,
    contacts: contactsReducer,
    companies: companiesReducer,
    actions: actionsReducer,
    chatbots: chatbotsReducer,
    contentCenter: contentCenterReducer,
    cannedResponses: cannedResponsesReducer,
    emailChannels: emailChannelsReducer,
    teams: teamsReducer,
    teammates: teammatesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
