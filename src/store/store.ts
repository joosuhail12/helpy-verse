
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import userReducer from './slices/user/userSlice';
import teamsReducer from './slices/teams/teamsSlice';
import contactsReducer from './slices/contacts/contactsSlice';
import companiesReducer from './slices/companies/companiesSlice';
import { actionsReducer } from './slices/actions/actionsSlice';
import { chatbotsReducer } from './slices/chatbots/chatbotsSlice';
import contentReducer from './slices/content/contentSlice';
import contentCenterReducer from './slices/automation/contentCenterSlice';
import tagsReducer from './slices/tagsSlice';
import { emailChannelsReducer } from './slices/emailChannels/emailChannelsSlice';
import { teammatesReducer } from './slices/teammates/teammatesSlice';
import inboxReducer from './slices/inboxSlice';
import { cannedResponsesReducer } from './slices/cannedResponses/cannedResponsesSlice';

// Create a root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  teams: teamsReducer,
  contacts: contactsReducer,
  companies: companiesReducer,
  actions: actionsReducer,
  chatbots: chatbotsReducer,
  content: contentReducer,
  contentCenter: contentCenterReducer,
  tags: tagsReducer,
  emailChannels: emailChannelsReducer,
  teammates: teammatesReducer,
  inbox: inboxReducer,
  cannedResponses: cannedResponsesReducer,
});

// Configure the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types (often used for non-serializable data)
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
