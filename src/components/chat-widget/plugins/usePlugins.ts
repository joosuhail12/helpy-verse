
import { useCallback } from 'react';
import { ChatMessage } from '../components/conversation/types';
import { ChatPluginContext, MessageInterceptPlugin, MessageTransformPlugin, UiExtensionPlugin, AnalyticsPlugin } from './types';
import { pluginRegistry } from './PluginRegistry';

/**
 * Hook to use plugins in the chat widget
 */
export const usePlugins = (workspaceId: string) => {
  /**
   * Apply message transform plugins to a message
   */
  const applyMessageTransforms = useCallback(async (
    message: ChatMessage, 
    conversationId: string
  ): Promise<ChatMessage> => {
    const context: ChatPluginContext = { conversationId, workspaceId };
    const transformPlugins = pluginRegistry.getPluginsByType<MessageTransformPlugin>('messageTransform');
    
    let transformedMessage = { ...message };
    
    for (const plugin of transformPlugins) {
      try {
        transformedMessage = await plugin.transformMessage(transformedMessage, context);
      } catch (error) {
        console.error(`Error in message transform plugin ${plugin.id}:`, error);
      }
    }
    
    return transformedMessage;
  }, [workspaceId]);
  
  /**
   * Apply message intercept plugins before sending a message
   */
  const interceptOutgoingMessage = useCallback(async (
    content: string, 
    conversationId: string
  ): Promise<string> => {
    const context: ChatPluginContext = { conversationId, workspaceId };
    const interceptPlugins = pluginRegistry.getPluginsByType<MessageInterceptPlugin>('messageIntercept');
    
    let transformedContent = content;
    
    for (const plugin of interceptPlugins) {
      if (plugin.beforeSendMessage) {
        try {
          transformedContent = await plugin.beforeSendMessage(transformedContent, context);
        } catch (error) {
          console.error(`Error in message intercept plugin ${plugin.id}:`, error);
        }
      }
    }
    
    return transformedContent;
  }, [workspaceId]);
  
  /**
   * Apply message intercept plugins after receiving a message
   */
  const interceptIncomingMessage = useCallback(async (
    message: ChatMessage, 
    conversationId: string
  ): Promise<void> => {
    const context: ChatPluginContext = { conversationId, workspaceId };
    const interceptPlugins = pluginRegistry.getPluginsByType<MessageInterceptPlugin>('messageIntercept');
    
    for (const plugin of interceptPlugins) {
      if (plugin.afterReceiveMessage) {
        try {
          await plugin.afterReceiveMessage(message, context);
        } catch (error) {
          console.error(`Error in message intercept plugin ${plugin.id}:`, error);
        }
      }
    }
  }, [workspaceId]);
  
  /**
   * Get UI extension components for a specific location
   */
  const getUiExtensions = useCallback((
    location: 'header' | 'footer' | 'sidebar' | 'messageActions',
    conversationId: string
  ): React.ReactNode[] => {
    const context: ChatPluginContext = { conversationId, workspaceId };
    const uiPlugins = pluginRegistry.getPluginsByType<UiExtensionPlugin>('uiExtension');
    
    return uiPlugins.map(plugin => {
      try {
        return plugin.renderComponent(location, context);
      } catch (error) {
        console.error(`Error rendering UI extension plugin ${plugin.id}:`, error);
        return null;
      }
    }).filter(Boolean);
  }, [workspaceId]);
  
  /**
   * Track an analytics event using analytics plugins
   */
  const trackEvent = useCallback(async (
    eventName: string, 
    data: any, 
    conversationId: string
  ): Promise<void> => {
    const context: ChatPluginContext = { conversationId, workspaceId };
    const analyticsPlugins = pluginRegistry.getPluginsByType<AnalyticsPlugin>('analytics');
    
    for (const plugin of analyticsPlugins) {
      try {
        await plugin.trackEvent(eventName, data, context);
      } catch (error) {
        console.error(`Error in analytics plugin ${plugin.id}:`, error);
      }
    }
  }, [workspaceId]);
  
  return {
    applyMessageTransforms,
    interceptOutgoingMessage,
    interceptIncomingMessage,
    getUiExtensions,
    trackEvent,
    registerPlugin: pluginRegistry.registerPlugin.bind(pluginRegistry),
    unregisterPlugin: pluginRegistry.unregisterPlugin.bind(pluginRegistry),
    getAllPlugins: pluginRegistry.getAllPlugins.bind(pluginRegistry),
    getPluginById: pluginRegistry.getPluginById.bind(pluginRegistry)
  };
};
