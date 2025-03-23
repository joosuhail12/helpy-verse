
# Chat Widget Theme Customization Guide

The Chat Widget is fully customizable using the `theme` prop, allowing you to match it to your brand colors and design preferences.

## Basic Usage

To customize your Chat Widget, simply pass a `theme` object to the `ChatWidget` component:

```jsx
import { ChatWidget } from '@/components/chat-widget/ChatWidget';

// Custom theme colors
const myTheme = {
  primary: '#FF5733',
  primaryForeground: '#FFFFFF',
  background: '#F8F9FA',
  foreground: '#333333'
};

// Apply the theme to the widget
<ChatWidget 
  workspaceId="your-workspace-id" 
  theme={myTheme}
/>
```

## Available Theme Properties

The theme object supports the following properties:

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

## Theme Examples

### Corporate Blue

```jsx
const corporateBlue = {
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
};
```

### Soft Green

```jsx
const softGreen = {
  primary: '#4CAF50',
  primaryForeground: '#FFFFFF',
  background: '#FAFFF9',
  foreground: '#3A3A3A',
  border: '#E0E8E0',
  userMessage: '#4CAF50',
  userMessageText: '#FFFFFF',
  agentMessage: '#F0F9F0',
  agentMessageText: '#3A3A3A',
  inputBackground: '#F5F8F5'
};
```

### Warm Orange

```jsx
const warmOrange = {
  primary: '#FF9800',
  primaryForeground: '#FFFFFF',
  background: '#FFFAF5',
  foreground: '#4A4A4A',
  border: '#EAEAEA',
  userMessage: '#FF9800',
  userMessageText: '#FFFFFF',
  agentMessage: '#FFF5EA',
  agentMessageText: '#4A4A4A',
  inputBackground: '#FAFAFA'
};
```

### Dark Theme

```jsx
const darkTheme = {
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
};
```

### Minimalist Gray

```jsx
const minimalistGray = {
  primary: '#6B7280',
  primaryForeground: '#FFFFFF',
  background: '#FFFFFF',
  foreground: '#374151',
  border: '#E5E7EB',
  userMessage: '#6B7280',
  userMessageText: '#FFFFFF',
  agentMessage: '#F3F4F6',
  agentMessageText: '#374151',
  inputBackground: '#F9FAFB'
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
      }
    });
  });
</script>
```

## Best Practices

1. **Maintain Contrast**: Ensure there's sufficient contrast between text and background colors for readability.
2. **Test on Different Backgrounds**: If your website has sections with different background colors, ensure the widget looks good across all of them.
3. **Brand Consistency**: Use colors that align with your brand's color palette.
4. **Accessibility**: Consider color-blind users when selecting colors. Avoid combinations that might be difficult to distinguish.

## Additional Color Palette Examples

### Pastel / Low Saturation Colors

```jsx
const pastelTheme = {
  primary: '#D6BCFA',
  primaryForeground: '#4A5568',
  background: '#FFFFFF',
  foreground: '#4A5568',
  border: '#E2E8F0',
  userMessage: '#D6BCFA',
  userMessageText: '#4A5568',
  agentMessage: '#F7FAFC',
  agentMessageText: '#4A5568',
  inputBackground: '#F7FAFC'
};
```

### Vivid Colors

```jsx
const vividTheme = {
  primary: '#8B5CF6',
  primaryForeground: '#FFFFFF',
  background: '#FFFFFF',
  foreground: '#1A202C',
  border: '#E2E8F0',
  userMessage: '#8B5CF6',
  userMessageText: '#FFFFFF',
  agentMessage: '#EDF2F7',
  agentMessageText: '#1A202C',
  inputBackground: '#F7FAFC'
};
```

## Troubleshooting

If your theme isn't being applied correctly:

1. Ensure you're passing the theme object to the correct prop (`theme`).
2. Check for typos in property names.
3. Verify that your color values are valid CSS colors (hex, rgb, rgba, etc.).

For any additional questions or support with theme customization, please reach out to our support team.
