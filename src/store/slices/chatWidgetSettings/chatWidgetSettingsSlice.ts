
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatWidgetSettings, ChatWidgetSettingsState } from './types';

const initialSettings: ChatWidgetSettings = {
  appearance: {
    primaryColor: '#9b87f5',
    position: 'right',
    compact: false,
  },
  content: {
    welcomeTitle: 'Hello there.',
    welcomeSubtitle: 'How can we help?',
  },
  features: {
    enableTypingIndicator: true,
    enableReactions: true,
    enableFileAttachments: true,
    enableReadReceipts: true,
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
    updateAppearanceSetting: (
      state, 
      action: PayloadAction<{ field: keyof ChatWidgetSettings['appearance']; value: string | boolean }>
    ) => {
      const { field, value } = action.payload;
      (state.settings.appearance[field] as typeof value) = value;
    },
    
    updateContentSetting: (
      state, 
      action: PayloadAction<{ field: keyof ChatWidgetSettings['content']; value: string }>
    ) => {
      const { field, value } = action.payload;
      state.settings.content[field] = value;
    },
    
    updateFeatureSetting: (
      state, 
      action: PayloadAction<{ field: keyof ChatWidgetSettings['features']; value: boolean }>
    ) => {
      const { field, value } = action.payload;
      state.settings.features[field] = value;
    },
    
    updateSettings: (
      state, 
      action: PayloadAction<Partial<ChatWidgetSettings>>
    ) => {
      state.settings = { 
        ...state.settings, 
        ...action.payload,
        appearance: {
          ...state.settings.appearance,
          ...(action.payload.appearance || {})
        },
        content: {
          ...state.settings.content,
          ...(action.payload.content || {})
        },
        features: {
          ...state.settings.features,
          ...(action.payload.features || {})
        }
      };
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
  updateAppearanceSetting,
  updateContentSetting,
  updateFeatureSetting,
  updateSettings,
  saveSettingsStart,
  saveSettingsSuccess,
  saveSettingsFailure,
  resetSettings
} = chatWidgetSettingsSlice.actions;

export default chatWidgetSettingsSlice.reducer;
