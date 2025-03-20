import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import contactReducer from './slices/contactSlice';
import companyReducer from './slices/companySlice';
import inboxReducer from './slices/inboxSlice';
import contentReducer from './slices/contentSlice';
import contentCenterReducer from './slices/automation/contentCenterSlice';

const rootReducer = {
  auth: authReducer,
  contacts: contactReducer,
  companies: companyReducer,
  inbox: inboxReducer,
  content: contentReducer,
  contentCenter: contentCenterReducer,
};

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
