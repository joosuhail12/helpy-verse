import { configureStore } from '@reduxjs/toolkit';
import actionsReducer from './slices/actions/actionsSlice';
import chatbotsReducer from './slices/chatbots/chatbotsSlice';
import contentReducer from './slices/content/contentSlice';
import authReducer from './slices/authSlice';
import companiesReducer from './slices/companies/companiesSlice';
import contactsReducer from './slices/contacts/contactsSlice';
import teammatesReducer from './slices/teammates/teammatesSlice';
import teamsReducer from './slices/teams/teamsSlice';
import securityReducer from './slices/securitySlice';
import tagsReducer from './slices/tagsSlice';
import emailChannelsReducer from './slices/emailChannels/emailChannelsSlice';
import cannedResponsesReducer from './slices/cannedResponses/cannedResponsesSlice';
import customersReducer from './slices/customers/customersSlice';
import ticketsReducer from './slices/tickets/ticketsSlice';

export const store = configureStore({
  reducer: {
    actions: actionsReducer,
    chatbots: chatbotsReducer,
    content: contentReducer,
    auth: authReducer,
    companies: companiesReducer,
    contacts: contactsReducer,
    teammates: teammatesReducer,
    teams: teamsReducer,
    security: securityReducer,
    tags: tagsReducer,
    emailChannels: emailChannelsReducer,
    cannedResponses: cannedResponsesReducer,
    customers: customersReducer,
    tickets: ticketsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

