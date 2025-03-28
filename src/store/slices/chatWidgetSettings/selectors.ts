
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const selectChatWidgetSettingsState = (state: RootState) => state.chatWidgetSettings;

export const selectChatWidgetSettings = createSelector(
  selectChatWidgetSettingsState,
  (state) => state.settings
);

export const selectChatWidgetLoading = createSelector(
  selectChatWidgetSettingsState,
  (state) => state.loading
);

export const selectChatWidgetError = createSelector(
  selectChatWidgetSettingsState,
  (state) => state.error
);

export const selectChatWidgetLastSaved = createSelector(
  selectChatWidgetSettingsState,
  (state) => state.lastSaved
);

// Selectors for individual settings
export const selectPrimaryColor = createSelector(
  selectChatWidgetSettings,
  (settings) => settings.primaryColor
);

export const selectWelcomeTitle = createSelector(
  selectChatWidgetSettings,
  (settings) => settings.welcomeTitle
);

export const selectWelcomeSubtitle = createSelector(
  selectChatWidgetSettings,
  (settings) => settings.welcomeSubtitle
);

export const selectPosition = createSelector(
  selectChatWidgetSettings,
  (settings) => settings.position
);

export const selectCompactMode = createSelector(
  selectChatWidgetSettings,
  (settings) => settings.compact
);
