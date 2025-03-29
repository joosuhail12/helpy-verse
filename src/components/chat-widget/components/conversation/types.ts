
import { 
  ChatMessage, 
  Conversation, 
  TypingStatus, 
  FileAttachment 
} from '@/types/chat';

// Re-export types from the core definitions
export { 
  ChatMessage, 
  Conversation, 
  TypingStatus, 
  FileAttachment 
};

/**
 * Props for the conversation view component
 */
export interface ConversationViewProps {
  workspaceId: string;
  conversationId: string;
  onBack?: () => void;
  compact?: boolean;
}

/**
 * Props for the message list component
 */
export interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  typingIndicator?: {
    agentName?: string;
    users: TypingStatus[];
  };
}

/**
 * Props for individual message items
 */
export interface MessageItemProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  showReadReceipt?: boolean;
  onReactionToggle?: (messageId: string, emoji: string) => void;
}

/**
 * Props for the message input component
 */
export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  attachments?: FileAttachment[];
  onAttachmentAdd?: (files: File[]) => void;
  onAttachmentRemove?: (id: string) => void;
  showEmojiPicker?: boolean;
  onEmojiSelect?: (emoji: string) => void;
}
