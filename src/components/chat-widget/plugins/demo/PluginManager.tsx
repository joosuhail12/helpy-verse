
import React, { useEffect } from 'react';
import { useChat } from '@/context/ChatContextWithPlugins';
import { SentimentAnalysisPlugin } from './SentimentAnalysisPlugin';
import { MessageFormattingPlugin } from './MessageFormattingPlugin';
import { ChatToolsPlugin } from './UiExtensionPlugin';
import { ChatAnalyticsPlugin } from './AnalyticsPlugin';

/**
 * Component that registers and manages plugins
 * Should be placed high in the component tree to initialize plugins
 */
export const PluginManager: React.FC = () => {
  const { registerPlugin, unregisterPlugin } = useChat();
  
  useEffect(() => {
    // Register all plugins
    registerPlugin(SentimentAnalysisPlugin);
    registerPlugin(MessageFormattingPlugin);
    registerPlugin(ChatToolsPlugin);
    registerPlugin(ChatAnalyticsPlugin);
    
    // Clean up on unmount
    return () => {
      unregisterPlugin(SentimentAnalysisPlugin.id);
      unregisterPlugin(MessageFormattingPlugin.id);
      unregisterPlugin(ChatToolsPlugin.id);
      unregisterPlugin(ChatAnalyticsPlugin.id);
    };
  }, [registerPlugin, unregisterPlugin]);
  
  // This component doesn't render anything
  return null;
};
