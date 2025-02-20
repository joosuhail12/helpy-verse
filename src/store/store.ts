
import { configureStore } from '@reduxjs/toolkit';
import actionsReducer from '@/store/slices/actions/actionsSlice';
import chatbotsReducer from '@/store/slices/chatbots/chatbotsSlice';
import contentReducer from '@/store/slices/content/contentSlice';
import authReducer from '@/store/slices/authSlice';
import companiesReducer from '@/store/slices/companies/companiesSlice';
import contactsReducer from '@/store/slices/contacts/contactsSlice';
import teammatesReducer from '@/store/slices/teammates/teammatesSlice';
import teamsReducer from '@/store/slices/teams/teamsSlice';
import securityReducer from '@/store/slices/securitySlice';
import tagsReducer from '@/store/slices/tagsSlice';
import emailChannelsReducer from '@/store/slices/emailChannels/emailChannelsSlice';
import cannedResponsesReducer from '@/store/slices/cannedResponses/cannedResponsesSlice';

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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

