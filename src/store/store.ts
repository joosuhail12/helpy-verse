
import { configureStore } from '@reduxjs/toolkit';

// Import reducers from their respective slice files
// Import auth reducer directly to avoid any circular dependencies
import reducer as authReducer from './slices/auth/authSlice';
import { actionsReducer } from './slices/actions/actionsSlice';
import contentReducer from './slices/content/contentSlice';
import contentCenterReducer from './slices/automation/contentCenterSlice';
import contactsReducer from './slices/contacts/contactsSlice';
import companiesReducer from './slices/companies/companiesSlice';
import ticketsReducer from './slices/tickets/ticketsSlice';
import tagsReducer from './slices/tagsSlice';
import teamsReducer from './slices/teams/teamsSlice';
import { chatWidgetSettingsReducer } from './slices/chatWidgetSettings/chatWidgetSettingsSlice';
import { emailChannelsReducer } from './slices/emailChannels/emailChannelsSlice';
import { cannedResponsesReducer } from './slices/cannedResponses/cannedResponsesSlice';
import { chatbotsReducer } from './slices/chatbots/chatbotsSlice';
import userReducer from './slices/user/userSlice';
import teammatesReducer from './slices/teammates/teammatesSlice';
import { chatReducer } from './slices/chat/chatSlice';

// Define the root reducer
const rootReducer = {
  auth: authReducer,
  actions: actionsReducer,
  content: contentReducer,
  contentCenter: contentCenterReducer,
  contacts: contactsReducer,
  companies: companiesReducer,
  tickets: ticketsReducer,
  tags: tagsReducer,
  teammates: teammatesReducer,
  teams: teamsReducer,
  emailChannels: emailChannelsReducer,
  cannedResponses: cannedResponsesReducer,
  chatbots: chatbotsReducer,
  user: userReducer,
  chatWidgetSettings: chatWidgetSettingsReducer,
  chat: chatReducer,
};

// Create store with proper error handling
console.log("Initializing Redux store...");
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
console.log("Redux store initialized successfully");

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
