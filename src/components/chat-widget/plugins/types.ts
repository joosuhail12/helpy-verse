
/**
 * Plugin system for the chat widget
 * Allows extending the widget with additional functionality
 */

import { ChatMessage } from '../components/conversation/types';

export interface ChatPluginContext {
  conversationId: string;
  workspaceId: string;
}

export interface MessageTransformPlugin {
  type: 'messageTransform';
  id: string;
  name: string;
  description?: string;
  transformMessage: (message: ChatMessage, context: ChatPluginContext) => Promise<ChatMessage> | ChatMessage;
}

export interface MessageInterceptPlugin {
  type: 'messageIntercept';
  id: string;
  name: string;
  description?: string;
  beforeSendMessage?: (content: string, context: ChatPluginContext) => Promise<string> | string;
  afterReceiveMessage?: (message: ChatMessage, context: ChatPluginContext) => Promise<void> | void;
}

export interface UiExtensionPlugin {
  type: 'uiExtension';
  id: string;
  name: string;
  description?: string;
  renderComponent: (location: 'header' | 'footer' | 'sidebar' | 'messageActions', context: ChatPluginContext) => React.ReactNode;
}

export interface AnalyticsPlugin {
  type: 'analytics';
  id: string;
  name: string;
  description?: string;
  trackEvent: (eventName: string, data: any, context: ChatPluginContext) => Promise<void> | void;
}

export type ChatPlugin = MessageTransformPlugin | MessageInterceptPlugin | UiExtensionPlugin | AnalyticsPlugin;
