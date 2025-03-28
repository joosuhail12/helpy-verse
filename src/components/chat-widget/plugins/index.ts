
// Export all plugin types and utilities
export * from './types';
export * from './PluginRegistry';
export * from './usePlugins';

// Export demo plugins
export * from './demo/SentimentAnalysisPlugin';
export * from './demo/MessageFormattingPlugin';
export * from './demo/UiExtensionPlugin';
export * from './demo/AnalyticsPlugin';
export * from './demo/PluginManager';

// Export a simple function to create a new plugin
export const createPlugin = <T extends any>(pluginConfig: T) => {
  return pluginConfig;
};
