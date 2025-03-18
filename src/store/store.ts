
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/user/userSlice';
import contactsReducer from './slices/contacts/contactsSlice';
import tagsReducer from './slices/tagsSlice';
import companiesReducer from './slices/contacts/companiesSlice';
import contentCenterReducer from './slices/automation/contentCenterSlice';
import { actionsReducer } from './slices/actions/actionsSlice';
import { chatbotsReducer } from './slices/chatbots/chatbotsSlice';
import contentReducer from './slices/content/contentSlice';
import { securityReducer } from './slices/securitySlice';
import { emailChannelsReducer } from './slices/emailChannels/emailChannelsSlice';
import { cannedResponsesReducer } from './slices/cannedResponses/cannedResponsesSlice';
import teamsReducer from './slices/teams/teamsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    contacts: contactsReducer,
    tags: tagsReducer,
    companies: companiesReducer,
    contentCenter: contentCenterReducer,
    actions: actionsReducer,
    chatbots: chatbotsReducer,
    content: contentReducer,
    security: securityReducer,
    emailChannels: emailChannelsReducer,
    cannedResponses: cannedResponsesReducer,
    teams: teamsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
