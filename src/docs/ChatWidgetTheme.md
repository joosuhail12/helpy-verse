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
  radius: 'md',
  shadow: 'md',
  labels: {
    welcomeTitle: 'Hey there!',
    welcomeSubtitle: 'Need any assistance today?',
    chatTitle: 'Customer Support'
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

| Property                  | Description                                    | Default Value |
|---------------------------|------------------------------------------------|---------------|
| `primary`                 | Primary accent color (buttons, active states)  | `#4F46E5`     |
| `primaryForeground`       | Text color on primary backgrounds              | `#ffffff`     |
| `primaryDark`             | Darker shade of primary color for hover states | `#3730A3`     |
| `background`              | Main background color                          | `#ffffff`     |
| `backgroundSecondary`     | Secondary background color                     | `#f9fafb`     |
| `foreground`              | Main text color                                | `#1A1F2C`     |
| `border`                  | Border color                                   | `#e5e7eb`     |
| `userMessage`             | Background color for user message bubbles      | `#4F46E5`     |
| `userMessageText`         | Text color for user messages                   | `#ffffff`     |
| `agentMessage`            | Background color for agent message bubbles     | `#f3f4f6`     |
| `agentMessageText`        | Text color for agent messages                  | `#1A1F2C`     |
| `inputBackground`         | Background color for the message input         | `#f9fafb`     |
| `muted`                   | Background color for muted elements            | `#f3f4f6`     |
| `mutedForeground`         | Text color for muted elements                  | `#6B7280`     |
| `secondary`               | Secondary color for alternative elements       | `#f3f4f6`     |
| `secondaryForeground`     | Text color for secondary elements              | `#1A1F2C`     |
| `headerBackground`        | Background color for the chat header           | `#ffffff`     |
| `headerForeground`        | Text color for the chat header                 | `#1A1F2C`     |
| `navigationBackground`    | Background color for navigation elements       | `#f9fafb`     |
| `navigationForeground`    | Text color for navigation elements             | `#1A1F2C`     |
| `accent`                  | Accent color for highlights and focus states   | `#8B5CF6`     |
| `accentForeground`        | Text color on accent backgrounds               | `#ffffff`     |
| `success`                 | Color for success states                       | `#10B981`     |
| `successForeground`       | Text color on success backgrounds              | `#ffffff`     |
| `warning`                 | Color for warning states                       | `#F59E0B`     |
| `warningForeground`       | Text color on warning backgrounds              | `#ffffff`     |
| `error`                   | Color for error states                         | `#EF4444`     |
| `errorForeground`         | Text color on error backgrounds                | `#ffffff`     |

### Layout Configuration

| Property    | Description                                | Default | Options                      |
|-------------|--------------------------------------------|---------|------------------------------|
| `position`  | Widget position on the screen              | `right` | `right`, `left`              |
| `compact`   | Reduced width mode for smaller screen area | `false` | `true`, `false`              |
| `radius`    | Border radius style throughout the widget  | `md`    | `none`, `sm`, `md`, `lg`, `full` |
| `shadow`    | Shadow depth for the widget                | `md`    | `none`, `sm`, `md`, `lg`, `xl` |

### Animation Configuration

| Property            | Description                                | Default  | Options                          |
|---------------------|--------------------------------------------|----------|---------------------------------|
| `animation.speed`   | Speed of animations throughout the widget  | `normal` | `slow`, `normal`, `fast`        |
| `animation.type`    | Type of animations for widget appearance   | `fade`   | `fade`, `slide`, `scale`, `none` |

### Font Configuration

| Property      | Description                           | Default        | Options                |
|---------------|---------------------------------------|----------------|------------------------|
| `fontFamily`  | Custom font family for the widget     | System default | Any valid font family  |

### Branding Configuration

| Property                | Description                               | Default | Options                |
|-------------------------|-------------------------------------------|---------|------------------------|
| `branding.logoUrl`      | URL to your brand logo                    | None    | Any valid image URL    |
| `branding.logoWidth`    | Width of the logo in pixels               | `24`    | Any number             |
| `branding.logoHeight`   | Height of the logo in pixels              | `24`    | Any number             |
| `branding.showPoweredBy`| Show "Powered by" branding text           | `true`  | `true`, `false`        |
| `branding.favicon`      | Custom favicon for the widget             | None    | Any valid image URL    |

### Text Label Configuration

You can customize all text labels in the widget:

| Property                  | Description                         | Default Value                        |
|---------------------------|-------------------------------------|--------------------------------------|
| `welcomeTitle`            | Title on home screen                | `Hello there.`                       |
| `welcomeSubtitle`         | Subtitle on home screen             | `How can we help?`                   |
| `askQuestionButton`       | Text for ask question button        | `Ask a question`                     |
| `recentMessagesTitle`     | Header for recent messages section  | `Recent messages`                    |
| `noMessagesText`          | Text shown when no messages exist   | `No messages yet. Start a conversation!` |
| `messagePlaceholder`      | Placeholder for message input       | `Type a message...`                  |
| `chatTitle`               | Title shown in chat header          | `Conversation`                       |
| `sendButtonText`          | Text for send button                | `Send`                               |
| `attachmentButtonLabel`   | Label for the attachment button     | `Attach file`                        |
| `conversationStartedText` | Text shown when conversation starts | `Conversation started`               |
| `poweredByText`           | Text for "powered by" label         | `Powered by`                         |
| `loadMoreText`            | Text for loading more messages      | `Load more`                          |
| `typingText`              | Text shown when someone is typing   | `typing...`                          |

## Theme Examples

### Corporate Blue

```jsx
const corporateBlue = {
  colors: {
    primary: '#0066CC',
    primaryForeground: '#FFFFFF',
    primaryDark: '#0052A3',
    background: '#FFFFFF',
    foreground: '#333333',
    border: '#E5E5E5',
    userMessage: '#0066CC',
    userMessageText: '#FFFFFF',
    agentMessage: '#F0F7FF',
    agentMessageText: '#333333',
    inputBackground: '#F5F5F5',
    headerBackground: '#0066CC',
    headerForeground: '#FFFFFF'
  },
  position: 'right',
  compact: false,
  radius: 'md',
  animation: {
    speed: 'normal',
    type: 'fade'
  },
  labels: {
    welcomeTitle: 'Welcome to Support',
    welcomeSubtitle: 'How can we assist you today?',
    chatTitle: 'Customer Support'
  },
  branding: {
    showPoweredBy: false
  }
};
```

### Dark Theme with Left Positioning

```jsx
const darkTheme = {
  colors: {
    primary: '#8B5CF6',
    primaryForeground: '#FFFFFF',
    primaryDark: '#7C4DE0',
    background: '#1E1E2E',
    foreground: '#E5E7EB',
    border: '#383851',
    userMessage: '#8B5CF6',
    userMessageText: '#FFFFFF',
    agentMessage: '#383851',
    agentMessageText: '#E5E7EB',
    inputBackground: '#2D2D44',
    headerBackground: '#252538',
    headerForeground: '#E5E7EB'
  },
  position: 'left',
  compact: true,
  radius: 'lg',
  shadow: 'lg',
  animation: {
    speed: 'fast',
    type: 'scale'
  },
  labels: {
    welcomeTitle: 'Support Chat',
    welcomeSubtitle: 'Our team is here to help',
    chatTitle: 'Support Team'
  }
};
```

### Minimalist Design with Custom Font

```jsx
const minimalistTheme = {
  colors: {
    primary: '#000000',
    primaryForeground: '#FFFFFF',
    primaryDark: '#333333',
    background: '#FFFFFF',
    foreground: '#000000',
    border: '#EEEEEE',
    userMessage: '#000000',
    userMessageText: '#FFFFFF',
    agentMessage: '#F5F5F5',
    agentMessageText: '#000000',
    inputBackground: '#F9F9F9'
  },
  position: 'right',
  compact: false,
  radius: 'none',
  shadow: 'sm',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  animation: {
    speed: 'normal',
    type: 'fade'
  },
  labels: {
    welcomeTitle: 'Questions?',
    welcomeSubtitle: 'Our team is ready to assist',
    chatTitle: 'Support'
  },
  branding: {
    logoUrl: 'https://example.com/logo.svg',
    logoWidth: 24,
    logoHeight: 24,
    showPoweredBy: false
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
          primaryDark: '#7c69d6',
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
        radius: 'md',
        shadow: 'md',
        labels: {
          welcomeTitle: 'Hello there',
          welcomeSubtitle: 'How can we help you?',
          chatTitle: 'Customer Support'
        },
        branding: {
          showPoweredBy: false
        }
      }
    });
  });
</script>
```

## Applying Theme Changes Dynamically

You can update the theme at runtime using the ThemeContext:

```jsx
import { useThemeContext } from '@/context/ThemeContext';

const YourComponent = () => {
  const { updateTheme } = useThemeContext();
  
  const switchToDarkMode = () => {
    updateTheme({
      colors: {
        background: '#1E1E2E',
        foreground: '#E5E7EB',
        // ... other dark mode colors
      }
    });
  };
  
  return (
    <button onClick={switchToDarkMode}>
      Switch to Dark Mode
    </button>
  );
};
```

## Best Practices

1. **Maintain Contrast**: Ensure there's sufficient contrast between text and background colors for readability.
2. **Test on Different Backgrounds**: If your website has sections with different background colors, ensure the widget looks good across all of them.
3. **Brand Consistency**: Use colors and terminology that align with your brand identity.
4. **Accessibility**: Consider color-blind users when selecting colors. Avoid combinations that might be difficult to distinguish.
5. **Responsive Considerations**: If your site serves many mobile users, consider using the `compact` mode.
6. **Left vs Right Positioning**: Choose positioning based on your site layout - if you have important elements on the right side, consider using `position: 'left'`.
7. **Animation Speed**: Adjust animation speed based on your audience - faster for tech-savvy users, slower for general audiences.
8. **Font Consistency**: Use font families that match your website's typography for a seamless experience.

## Troubleshooting

If your theme isn't being applied correctly:

1. Ensure you're passing the theme object with the correct structure.
2. Check for typos in property names.
3. Verify that your color values are valid CSS colors (hex, rgb, rgba, etc.).
4. Make sure you're not accidentally overriding your theme settings elsewhere.
5. For dynamic theme changes, ensure you're updating the correct properties.
6. Check that all required properties (`primaryDark`, `chatTitle`, etc.) are included.

For any additional questions or support with theme customization, please reach out to our support team.
