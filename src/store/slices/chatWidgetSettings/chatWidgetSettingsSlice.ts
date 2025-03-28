
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatWidgetSettings, ChatWidgetSettingsState } from './types';

const initialSettings: ChatWidgetSettings = {
  primaryColor: '#9b87f5',
  welcomeTitle: 'Hello there.',
  welcomeSubtitle: 'How can we help?',
  position: 'right',
  compact: false,
  enableTypingIndicator: true,
  enableReactions: true,
  enableFileAttachments: true,
  enableReadReceipts: true
};

const initialState: ChatWidgetSettingsState = {
  settings: initialSettings,
  loading: false,
  error: null,
  lastSaved: null
};

export const chatWidgetSettingsSlice = createSlice({
  name: 'chatWidgetSettings',
  initialState,
  reducers: {
    updateSetting: (
      state, 
      action: PayloadAction<{ field: keyof ChatWidgetSettings; value: any }>
    ) => {
      const { field, value } = action.payload;
      state.settings[field] = value;
    },
    
    updateSettings: (
      state, 
      action: PayloadAction<Partial<ChatWidgetSettings>>
    ) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    saveSettingsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    saveSettingsSuccess: (state) => {
      state.loading = false;
      state.lastSaved = Date.now();
    },
    
    saveSettingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    resetSettings: (state) => {
      state.settings = initialSettings;
    }
  }
});

export const {
  updateSetting,
  updateSettings,
  saveSettingsStart,
  saveSettingsSuccess,
  saveSettingsFailure,
  resetSettings
} = chatWidgetSettingsSlice.actions;

export default chatWidgetSettingsSlice.reducer;
