
import { configureStore } from '@reduxjs/toolkit';
// Import reducers using proper named exports
import { reducer as authReducer } from './slices/auth/authSlice';
import { actionsReducer } from './slices/actions/actionsSlice';
import contentReducer from './slices/content/contentSlice';
import contentCenterReducer from './slices/automation/contentCenterSlice';
import contactsReducer from './slices/contacts/contactsSlice';
import companiesReducer from './slices/companies/companiesSlice';
import inboxReducer from './slices/inboxSlice';
import tagsReducer from './slices/tagsSlice';
import { reducer as teammatesReducer } from './slices/teammates/teammatesSlice';
import teamsReducer from './slices/teams/teamsSlice';
import { reducer as emailChannelsReducer } from './slices/emailChannels/emailChannelsSlice';
import { reducer as cannedResponsesReducer } from './slices/cannedResponses/cannedResponsesSlice';
import { reducer as chatbotsReducer } from './slices/chatbots/chatbotsSlice';
// Import userReducer correctly to avoid initialization error
import userReducer from './slices/user/userSlice';

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
