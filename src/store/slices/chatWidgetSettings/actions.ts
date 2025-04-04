
import { createAsyncThunk } from '@reduxjs/toolkit';
import { saveSettingsStart, saveSettingsSuccess, saveSettingsFailure } from './chatWidgetSettingsSlice';
import { ChatWidgetSettings } from './types';
import { RootState } from '../../store';
import { format } from 'date-fns';

// Simulating API call to save settings to backend
const saveChatWidgetSettingsToAPI = async (settings: ChatWidgetSettings): Promise<void> => {
  // In a real application, this would be an API call
  return new Promise((resolve) => {
    // Simulating network delay
    setTimeout(() => {
      // Save to localStorage for persistence
      localStorage.setItem('chatWidgetSettings', JSON.stringify(settings));
      resolve();
    }, 500);
  });
};

// Thunk for saving settings
export const saveChatWidgetSettings = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'chatWidgetSettings/save',
  async (_, { getState, dispatch }) => {
    try {
      dispatch(saveSettingsStart());
      const state = getState();
      const settings = state.chatWidgetSettings.settings;
      
      await saveChatWidgetSettingsToAPI(settings);
      
      dispatch(saveSettingsSuccess());
      
      // Log the save action
      console.log(`Chat widget settings saved at ${format(new Date(), 'PPpp')}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save settings';
      dispatch(saveSettingsFailure(errorMessage));
      throw error;
    }
  }
);

// Thunk for loading settings from localStorage on app init
export const loadChatWidgetSettings = createAsyncThunk(
  'chatWidgetSettings/load',
  async (_, { dispatch }) => {
    try {
      const savedSettings = localStorage.getItem('chatWidgetSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings) as ChatWidgetSettings;
        return settings;
      }
      return null;
    } catch (error) {
      console.error('Failed to load chat widget settings:', error);
      return null;
    }
  }
);
