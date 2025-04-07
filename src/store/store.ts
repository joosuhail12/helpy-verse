
import { configureStore } from '@reduxjs/toolkit';

// Import reducers with proper techniques to avoid initialization issues
import authReducer from './slices/auth/authSlice';
import { actionsReducer } from './slices/actions/actionsSlice';
import contentReducer from './slices/content/contentSlice';
import contentCenterReducer from './slices/automation/contentCenterSlice';
import contactsReducer from './slices/contacts/contactsSlice';
import companiesReducer from './slices/companies/companiesSlice';
import inboxReducer from './slices/inboxSlice';
import tagsReducer from './slices/tagsSlice';
import teamsReducer from './slices/teams/teamsSlice';
import { emailChannelsReducer } from './slices/emailChannels/emailChannelsSlice';
import { cannedResponsesReducer } from './slices/cannedResponses/cannedResponsesSlice';
import { chatbotsReducer } from './slices/chatbots/chatbotsSlice';

// Fix circular dependency by importing directly from their files
import userReducer from './slices/user/userSlice';
import { reducer as teammatesReducer } from './slices/teammates/teammatesSlice';

// Define the root reducer with all slices
const rootReducer = {
  auth: authReducer,
  actions: actionsReducer,
  content: contentReducer,
  contentCenter: contentCenterReducer,
  contacts: contactsReducer,
  companies: companiesReducer,
  inbox: inboxReducer,
  tags: tagsReducer,
  teammates: teammatesReducer,
  teams: teamsReducer,
  emailChannels: emailChannelsReducer,
  cannedResponses: cannedResponsesReducer,
  chatbots: chatbotsReducer,
  user: userReducer,
};

// Configure store with middleware options
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
