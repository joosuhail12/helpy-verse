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
  enableReadReceipts: true,
  colors: {
    background: '#ffffff',
    backgroundSecondary: '#f9f9f9',
    foreground: '#1A1F2C',
    border: '#eaeaea',
    userMessage: {
      background: '#9b87f5',
      text: '#ffffff'
    },
    agentMessage: {
      background: '#f1f1f1',
      text: '#1A1F2C'
    },
    input: {
      background: '#ffffff',
      text: '#1A1F2C',
      border: '#e0e0e0'
    },
    button: {
      background: '#9b87f5',
      text: '#ffffff',
      hover: '#7E57C2'
    }
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    fontSize: {
      small: '12px',
      medium: '14px',
      large: '16px'
    }
  },
  layout: {
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px'
    },
    spacing: {
      small: '4px',
      medium: '8px',
      large: '16px'
    }
  }
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
      action: PayloadAction<{ field: keyof ChatWidgetSettings; value: string | boolean }>
    ) => {
      const { field, value } = action.payload;
      // Type assertion is needed because the 'field' can refer to either string or boolean properties
      // This helps TypeScript understand that we're intentionally assigning the right type
      (state.settings[field] as typeof value) = value;
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
