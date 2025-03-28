
# Chat Widget Plugin System

The chat widget includes a flexible plugin system that allows you to extend its functionality in various ways. This document explains how to create, register, and use plugins.

## Plugin Types

The plugin system supports four types of plugins:

1. **Message Transform Plugins**: These plugins transform messages before they are displayed.
2. **Message Intercept Plugins**: These plugins intercept messages before they are sent or after they are received.
3. **UI Extension Plugins**: These plugins add UI components to different parts of the chat widget.
4. **Analytics Plugins**: These plugins track events in the chat widget.

## Creating a Plugin

To create a plugin, you need to implement one of the plugin interfaces and register it with the plugin registry.

### Example: Message Transform Plugin

```typescript
import { MessageTransformPlugin, ChatPluginContext } from '../types';
import { ChatMessage } from '../../components/conversation/types';

export const MyTransformPlugin: MessageTransformPlugin = {
  type: 'messageTransform',
  id: 'my-transform',
  name: 'My Transform Plugin',
  description: 'Transforms messages in some way',
  
  transformMessage: (message: ChatMessage, context: ChatPluginContext) => {
    // Transform the message
    return {
      ...message,
      content: message.content.toUpperCase()
    };
  }
};
```

### Example: UI Extension Plugin

```typescript
import React from 'react';
import { UiExtensionPlugin, ChatPluginContext } from '../types';

export const MyUiPlugin: UiExtensionPlugin = {
  type: 'uiExtension',
  id: 'my-ui-extension',
  name: 'My UI Extension',
  description: 'Adds UI components to the chat widget',
  
  renderComponent: (location: 'header' | 'footer' | 'sidebar' | 'messageActions', context: ChatPluginContext) => {
    if (location === 'header') {
      return (
        <button className="text-sm text-blue-600">My Button</button>
      );
    }
    return null;
  }
};
```

## Registering Plugins

You can register plugins in two ways:

1. Using the `useChat` hook:

```typescript
import { useChat } from '@/context/ChatContextWithPlugins';
import { MyPlugin } from './plugins/MyPlugin';

const MyComponent = () => {
  const { registerPlugin } = useChat();
  
  useEffect(() => {
    registerPlugin(MyPlugin);
    
    return () => {
      // Clean up when component unmounts
      unregisterPlugin(MyPlugin.id);
    };
  }, []);
  
  // Rest of your component
};
```

2. Using the `PluginManager` component for multiple plugins:

```typescript
import React, { useEffect } from 'react';
import { useChat } from '@/context/ChatContextWithPlugins';
import { PluginA } from './PluginA';
import { PluginB } from './PluginB';

export const PluginManager: React.FC = () => {
  const { registerPlugin, unregisterPlugin } = useChat();
  
  useEffect(() => {
    // Register all plugins
    registerPlugin(PluginA);
    registerPlugin(PluginB);
    
    // Clean up on unmount
    return () => {
      unregisterPlugin(PluginA.id);
      unregisterPlugin(PluginB.id);
    };
  }, [registerPlugin, unregisterPlugin]);
  
  // This component doesn't render anything
  return null;
};
```

## Plugin Context

Plugins receive a context object that contains information about the current conversation. The context includes:

- `conversationId`: The ID of the current conversation
- `workspaceId`: The ID of the current workspace

## Plugin Lifecycle

Plugins are registered when the chat widget is initialized and remain active until they are unregistered. You can register and unregister plugins at any time.

## Best Practices

- Keep plugins focused on a single task
- Handle errors gracefully in your plugins
- Clean up resources when plugins are unregistered
- Avoid heavy processing in message transform plugins as they run frequently
- Use the plugin context to access conversationId and workspaceId
