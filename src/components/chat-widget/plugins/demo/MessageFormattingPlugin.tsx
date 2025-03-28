
import React from 'react';
import { MessageInterceptPlugin, ChatPluginContext } from '../types';

/**
 * A demo plugin that formats messages before sending
 * Converts markdown-like syntax to proper formatting
 */
export const MessageFormattingPlugin: MessageInterceptPlugin = {
  type: 'messageIntercept',
  id: 'message-formatting',
  name: 'Message Formatting',
  description: 'Formats messages with markdown-like syntax',
  
  beforeSendMessage: (content: string, context: ChatPluginContext) => {
    // Convert *text* to bold
    let formattedContent = content.replace(/\*([^*]+)\*/g, '**$1**');
    
    // Convert _text_ to italic
    formattedContent = formattedContent.replace(/\_([^_]+)\_/g, '*$1*');
    
    // Convert code blocks
    formattedContent = formattedContent.replace(/\`([^`]+)\`/g, '`$1`');
    
    // Add emojis for common expressions (basic example)
    formattedContent = formattedContent
      .replace(/:smile:/g, '😊')
      .replace(/:sad:/g, '😢')
      .replace(/:thumbsup:/g, '👍')
      .replace(/:heart:/g, '❤️');
    
    return formattedContent;
  }
};
