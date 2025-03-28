
import React from 'react';
import { UiExtensionPlugin, ChatPluginContext } from '../types';

/**
 * A demo plugin that adds UI extensions to different parts of the chat widget
 */
export const ChatToolsPlugin: UiExtensionPlugin = {
  type: 'uiExtension',
  id: 'chat-tools',
  name: 'Chat Tools',
  description: 'Adds additional tools to the chat interface',
  
  renderComponent: (location: 'header' | 'footer' | 'sidebar' | 'messageActions', context: ChatPluginContext) => {
    switch (location) {
      case 'header':
        return (
          <div key="chat-tools-header" className="px-2">
            <button className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              Tools
            </button>
          </div>
        );
        
      case 'messageActions':
        return (
          <div key="chat-tools-actions" className="flex space-x-1">
            <button className="p-1 text-gray-500 hover:text-primary rounded-full" title="Translate message">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
            </button>
            <button className="p-1 text-gray-500 hover:text-primary rounded-full" title="Copy to clipboard">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
        );
        
      case 'footer':
        return (
          <div key="chat-tools-footer" className="flex items-center justify-center text-xs text-gray-500 py-1">
            <button className="hover:text-primary mx-1">Clear chat</button>
            <span>•</span>
            <button className="hover:text-primary mx-1">Export conversation</button>
          </div>
        );
        
      default:
        return null;
    }
  }
};
