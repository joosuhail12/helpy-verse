
# Chat Widget Theme Customization Guide

The Chat Widget is fully customizable using the `theme` prop, allowing you to match it to your brand colors, positioning, texts, and design preferences.

## Basic Usage

To customize your Chat Widget, simply pass a `theme` object to the `ChatWidget` component:

```jsx
import { ChatWidget } from '@/components/chat-widget/ChatWidget';

// Custom theme colors and options
const myTheme = {
  colors: {
    primary: '#FF5733',
    primaryForeground: '#FFFFFF',
    background: '#F8F9FA',
    foreground: '#333333'
  },
  position: 'right',
  compact: false,
  labels: {
    welcomeTitle: 'Hey there!',
    welcomeSubtitle: 'Need any assistance today?'
  }
};

// Apply the theme to the widget
<ChatWidget 
  workspaceId="your-workspace-id" 
  theme={myTheme}
/>
```

## Available Theme Properties

### Color Configuration

The theme object supports the following color properties:

| Property           | Description                                    | Default Value |
|--------------------|------------------------------------------------|---------------|
| `primary`          | Primary accent color (buttons, active states)  | `#9b87f5`     |
| `primaryForeground`| Text color on primary backgrounds              | `#ffffff`     |
| `background`       | Main background color                          | `#ffffff`     |
| `foreground`       | Main text color                                | `#1A1F2C`     |
| `border`           | Border color                                   | `#e1e1e1`     |
| `userMessage`      | Background color for user message bubbles      | `#9b87f5`     |
| `userMessageText`  | Text color for user messages                   | `#ffffff`     |
| `agentMessage`     | Background color for agent message bubbles     | `#f1f1f1`     |
| `agentMessageText` | Text color for agent messages                  | `#1A1F2C`     |
| `inputBackground`  | Background color for the message input         | `#f9f9f9`     |

### Layout Configuration

| Property   | Description                                | Default | Options           |
|------------|--------------------------------------------|---------|-------------------|
| `position` | Widget position on the screen              | `right` | `right`, `left`   |
| `compact`  | Reduced width mode for smaller screen area | `false` | `true`, `false`   |

### Text Label Configuration

You can customize all text labels in the widget:

| Property                  | Description                         | Default Value                        |
|---------------------------|-------------------------------------|--------------------------------------|
| `welcomeTitle`            | Title on home screen                | `Hello there.`                       |
| `welcomeSubtitle`         | Subtitle on home screen             | `How can we help?`                   |
| `askQuestionButton`       | Text for ask question button        | `Ask a question`                     |
| `recentMessagesTitle`     | Header for recent messages section  | `Recent message`                     |
| `noMessagesText`          | Text shown when no messages exist   | `No messages yet. Start a conversation!` |
| `startConversationButton` | Text for start conversation button  | `Start a conversation`               |
| `messagePlaceholder`      | Placeholder for message input       | `Type a message...`                  |

## Theme Examples

### Corporate Blue

```jsx
const corporateBlue = {
  colors: {
    primary: '#0066CC',
    primaryForeground: '#FFFFFF',
    background: '#FFFFFF',
    foreground: '#333333',
    border: '#E5E5E5',
    userMessage: '#0066CC',
    userMessageText: '#FFFFFF',
    agentMessage: '#F0F7FF',
    agentMessageText: '#333333',
    inputBackground: '#F5F5F5'
  },
  position: 'right',
  compact: false,
  labels: {
    welcomeTitle: 'Welcome to Support',
    welcomeSubtitle: 'How can we assist you today?'
  }
};
```

### Dark Theme with Left Positioning

```jsx
const darkTheme = {
  colors: {
    primary: '#8B5CF6',
    primaryForeground: '#FFFFFF',
    background: '#1E1E2E',
    foreground: '#E5E7EB',
    border: '#383851',
    userMessage: '#8B5CF6',
    userMessageText: '#FFFFFF',
    agentMessage: '#383851',
    agentMessageText: '#E5E7EB',
    inputBackground: '#2D2D44'
  },
  position: 'left',
  compact: true,
  labels: {
    welcomeTitle: 'Support Chat',
    welcomeSubtitle: 'Our team is here to help'
  }
};
```

## Implementing on Your Website

If you're integrating the Chat Widget on your website, here's how to pass the theme:

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat widget with custom theme
    window.ChatWidget.init({
      workspaceId: 'your-workspace-id',
      theme: {
        colors: {
          primary: '#9b87f5',
          primaryForeground: '#FFFFFF',
          background: '#FFFFFF',
          foreground: '#1A1F2C',
          border: '#E1E1E1',
          userMessage: '#9b87f5',
          userMessageText: '#FFFFFF',
          agentMessage: '#F1F1F1',
          agentMessageText: '#1A1F2C',
          inputBackground: '#F9F9F9'
        },
        position: 'right',
        compact: false,
        labels: {
          welcomeTitle: 'Hello there',
          welcomeSubtitle: 'How can we help you?'
        }
      }
    });
  });
</script>
```

## Best Practices

1. **Maintain Contrast**: Ensure there's sufficient contrast between text and background colors for readability.
2. **Test on Different Backgrounds**: If your website has sections with different background colors, ensure the widget looks good across all of them.
3. **Brand Consistency**: Use colors and terminology that align with your brand identity.
4. **Accessibility**: Consider color-blind users when selecting colors. Avoid combinations that might be difficult to distinguish.
5. **Responsive Considerations**: If your site serves many mobile users, consider using the `compact` mode.
6. **Left vs Right Positioning**: Choose positioning based on your site layout - if you have important elements on the right side, consider using `position: 'left'`.

## Troubleshooting

If your theme isn't being applied correctly:

1. Ensure you're passing the theme object with the correct structure.
2. Check for typos in property names.
3. Verify that your color values are valid CSS colors (hex, rgb, rgba, etc.).
4. Make sure you're not accidentally overriding your theme settings elsewhere.

For any additional questions or support with theme customization, please reach out to our support team.
