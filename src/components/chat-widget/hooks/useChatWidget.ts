
import { useWidgetAppearance } from '@/hooks/chat/useWidgetAppearance';
import { useMessaging } from '@/hooks/chat/useMessaging';
import { useFileAttachments } from '@/hooks/chat/useFileAttachments';
import { usePresenceNotifications } from '@/hooks/chat/usePresenceNotifications';
import { useWidgetStatus } from '@/hooks/chat/useWidgetStatus';
import { ThemeConfig, ChatMessage, FileAttachment as ChatFileAttachment } from '@/types/chat';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface ChatWidgetOptions {
  workspaceId: string;
  conversationId: string;
  settings?: Partial<ChatWidgetSettings>;
  userName?: string;
}

/**
 * Return type for the useChatWidget hook
 */
export interface UseChatWidgetReturn {
  // Widget appearance
  theme: ThemeConfig['colors'] & Record<string, string>;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  
  // Widget status
  isConnected: boolean;
  isReconnecting: boolean;
  connectionError: Error | null;
  
  // Messages
  messages: ChatMessage[];
  isLoading: boolean;
  newMessageText: string;
  setNewMessageText: (text: string) => void;
  sendMessage: (content: string, metadata?: Record<string, any>) => Promise<boolean>;
  
  // Attachments
  attachments: ChatFileAttachment[];
  addAttachments: (files: File[]) => void;
  removeAttachment: (id: string) => void;
  
  // Presence
  agents: any[]; // Replace with proper agent type
  typingUsers: string[];
  notifications: any[]; // Replace with proper notification type
  clearNotification: (id: string) => void;
  
  // Access to underlying hooks for advanced usage
  appearance: ReturnType<typeof useWidgetAppearance>;
  messaging: ReturnType<typeof useMessaging>;
  fileAttachments: ReturnType<typeof useFileAttachments>;
  presenceNotifications: ReturnType<typeof usePresenceNotifications>;
  widgetStatus: ReturnType<typeof useWidgetStatus>;
}

/**
 * Main hook that combines all chat widget functionality
 */
export const useChatWidget = ({
  workspaceId,
  conversationId,
  settings,
  userName
}: ChatWidgetOptions): UseChatWidgetReturn => {
  // Widget appearance
  const appearance = useWidgetAppearance({ initialSettings: settings });
  
  // Messaging functionality
  const messaging = useMessaging({
    conversationId,
    workspaceId,
    userName
  });
  
  // File attachments
  const fileAttachments = useFileAttachments();
  
  // Presence and notifications
  const presenceNotifications = usePresenceNotifications(conversationId, workspaceId);
  
  // Widget connection status
  const widgetStatus = useWidgetStatus();
  
  // Combined send message function that handles files
  const sendMessageWithAttachments = async (content: string, metadata: Record<string, any> = {}): Promise<boolean> => {
    // Don't send empty messages
    if (!content.trim() && fileAttachments.attachments.length === 0) {
      return false;
    }
    
    try {
      // First, upload any attachments
      const fileUrls = await fileAttachments.uploadAttachments(conversationId);
      
      // Then send the message with file URLs
      const success = await messaging.sendMessage(content, {
        files: fileUrls.length > 0 ? fileUrls : undefined,
        ...metadata
      });
      
      // Clear attachments if successful
      if (success) {
        fileAttachments.clearAttachments();
      }
      
      return success;
    } catch (error) {
      console.error('Error sending message with attachments:', error);
      return false;
    }
  };
  
  // Map useFileAttachment's attachments to ChatFileAttachment format
  const mappedAttachments: ChatFileAttachment[] = fileAttachments.attachments.map(attachment => ({
    id: attachment.id,
    name: attachment.file.name,
    type: attachment.file.type,
    size: attachment.file.size,
    url: attachment.previewUrl || '',
    uploadProgress: attachment.uploadProgress
  }));
  
  // Map typing users to string array
  const typingUserNames: string[] = messaging.typingUsers.map(user => {
    if (typeof user === 'string') return user;
    // Handle different possible structures based on the error message
    if ('name' in user) return user.name || 'Unknown user';
    if (user && typeof user === 'object' && 'username' in user) return (user as any).username || 'Unknown user';
    if (user && typeof user === 'object' && 'clientId' in user) return (user as any).clientId || 'Unknown user';
    return 'Unknown user';
  });
  
  // Create a notification clearer that accepts string IDs
  const clearNotificationById = (id: string) => {
    if (!Array.isArray(presenceNotifications.notifications)) {
      console.error('Notifications is not an array:', presenceNotifications.notifications);
      return;
    }
    
    const notificationIndex = presenceNotifications.notifications.findIndex(n => {
      if (typeof n === 'string') return n === id;
      if (n && typeof n === 'object') return (n as any).id === id;
      return false;
    });
    
    if (notificationIndex !== -1) {
      presenceNotifications.clearNotification(notificationIndex);
    }
  };
  
  return {
    // Widget appearance
    theme: appearance.colors,
    updateTheme: (updates: Partial<ThemeConfig>) => {
      // Map from ThemeConfig updates to colors object expected by appearance
      const colorUpdates = updates.colors || {};
      appearance.setColors({ ...appearance.colors, ...colorUpdates });
    },
    
    // Widget status
    isConnected: widgetStatus.isConnected,
    isReconnecting: widgetStatus.isConnecting, // Map isConnecting to isReconnecting
    connectionError: null, // Set a default null value since widgetStatus doesn't have error property
    
    // Access to all original hooks
    appearance,
    messaging,
    fileAttachments,
    presenceNotifications,
    widgetStatus,
    
    // Messaging
    messages: messaging.messages,
    isLoading: messaging.isLoading,
    newMessageText: messaging.newMessageText,
    setNewMessageText: messaging.setNewMessageText,
    sendMessage: sendMessageWithAttachments,
    
    // Attachments (properly mapped to expected type)
    attachments: mappedAttachments,
    addAttachments: fileAttachments.addAttachments,
    removeAttachment: fileAttachments.removeAttachment,
    
    // Presence (properly mapped to expected types)
    agents: presenceNotifications.agents || [],
    typingUsers: typingUserNames,
    notifications: presenceNotifications.notifications || [],
    clearNotification: clearNotificationById
  };
};
