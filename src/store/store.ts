
import { configureStore } from '@reduxjs/toolkit';
// Import auth reducer directly from the slice file to avoid circular imports
import authReducer from './slices/auth/authSlice';
import { actionsReducer } from './slices/actions/actionsSlice';
import contentReducer from './slices/content/contentSlice';
import contentCenterReducer from './slices/automation/contentCenterSlice';
import contactsReducer from './slices/contacts/contactsSlice';
import companiesReducer from './slices/companies/companiesSlice';
import ticketsReducer from './slices/tickets/ticketsSlice';
import tagsReducer from './slices/tagsSlice';
import teammatesReducer from './slices/teammates';
import teamsReducer from './slices/teams/teamsSlice';
import { emailChannelsReducer } from './slices/emailChannels/emailChannelsSlice';
import { cannedResponsesReducer } from './slices/cannedResponses/cannedResponsesSlice';
import { chatbotsReducer } from './slices/chatbots/chatbotsSlice';
import userReducer from './slices/user/userSlice';
import { chatWidgetSettingsReducer } from './slices/chatWidgetSettings';

// Define the root reducer with all slices
const rootReducer = {
  auth: authReducer,
  actions: actionsReducer,
  content: contentReducer,
  contentCenter: contentCenterReducer,
  contacts: contactsReducer,
  companies: companiesReducer,
  tickets: ticketsReducer, // Renamed from inbox to tickets for clarity
  tags: tagsReducer,
  teammates: teammatesReducer,
  teams: teamsReducer,
  emailChannels: emailChannelsReducer,
  cannedResponses: cannedResponsesReducer,
  chatbots: chatbotsReducer,
  user: userReducer,
  chatWidgetSettings: chatWidgetSettingsReducer,
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
