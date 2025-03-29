
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

// Appearance selectors
export const selectAppearanceSettings = createSelector(
  selectChatWidgetSettings,
  (settings) => settings.appearance
);

export const selectPrimaryColor = createSelector(
  selectAppearanceSettings,
  (appearance) => appearance.primaryColor
);

export const selectPosition = createSelector(
  selectAppearanceSettings,
  (appearance) => appearance.position
);

export const selectCompactMode = createSelector(
  selectAppearanceSettings,
  (appearance) => appearance.compact
);

// Content selectors
export const selectContentSettings = createSelector(
  selectChatWidgetSettings,
  (settings) => settings.content
);

export const selectWelcomeTitle = createSelector(
  selectContentSettings,
  (content) => content.welcomeTitle
);

export const selectWelcomeSubtitle = createSelector(
  selectContentSettings,
  (content) => content.welcomeSubtitle
);

// Feature selectors
export const selectFeatureSettings = createSelector(
  selectChatWidgetSettings,
  (settings) => settings.features
);

export const selectTypingIndicatorEnabled = createSelector(
  selectFeatureSettings,
  (features) => features.enableTypingIndicator
);

export const selectReactionsEnabled = createSelector(
  selectFeatureSettings,
  (features) => features.enableReactions
);

export const selectFileAttachmentsEnabled = createSelector(
  selectFeatureSettings,
  (features) => features.enableFileAttachments
);

export const selectReadReceiptsEnabled = createSelector(
  selectFeatureSettings,
  (features) => features.enableReadReceipts
);
