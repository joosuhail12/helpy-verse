
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import auth from './slices/auth/authSlice';
import tags from './slices/tags/tagsSlice';
import tickets from './slices/tickets/ticketsSlice';
import content from './slices/content/contentSlice';
import contacts from './slices/contacts/contactsSlice';
import companies from './slices/companies/companiesSlice';
import actions from './slices/actions/actionsSlice';
import chatbots from './slices/chatbots/chatbotsSlice';
import contentCenter from './slices/automation/contentCenterSlice';
import cannedResponses from './slices/cannedResponses/cannedResponsesSlice';
import emailChannels from './slices/emailChannels/emailChannelsSlice';
import teams from './slices/teams/teamsSlice';
import teammates from './slices/teammates/teammatesSlice';

const rootReducer = combineReducers({
  auth,
  tags,
  tickets,
  content,
  contacts,
  companies,
  actions,
  chatbots,
  contentCenter,
  cannedResponses,
  emailChannels,
  teams,
  teammates,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
