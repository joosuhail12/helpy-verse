
import type { Ticket } from '@/types/ticket';
import { BaseMessage, UserPresence as CoreUserPresence } from '@/types/chat';

// Export UserPresence for use in other components
export interface UserPresence {
  id?: string;
  userId: string;
  name?: string;
  lastActive: string | Date;
  status?: 'online' | 'offline' | 'away' | 'busy';
  isTyping?: boolean;
  location?: {
    ticketId: string;
    area: string;
  };
}

export interface Message extends BaseMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isCustomer: boolean;
  readBy?: string[];
  reactions?: Record<string, string[]>;
  type?: 'message' | 'internal_note';
}

export interface ConversationPanelProps {
  ticket: Ticket;
  onClose: () => void;
}

export interface MessageListProps {
  messages: Message[];
  typingUsers: string[];
  ticket: Ticket;
  onReply: (content: string) => void;
  isLoading?: boolean;
}

export interface MessageItemProps {
  message: Message;
  ticket: Ticket;
  onReply: (content: string) => void;
}

export interface MessageToolbarProps {
  editor: any; // Replace with proper TipTap editor type
  onInsertPlaceholder: (type: 'customer' | 'company' | 'ticket') => void;
  ticket: Ticket;
  disabled?: boolean;
  isInternalNote: boolean;
  setIsInternalNote: (value: boolean) => void;
  onEmojiSelect: (emojiData: any) => void;
  onFilesAdded: (files: File[]) => void;
  uploadProgress: Record<string, number>;
  onRemoveFile: (file: File) => void;
  files: File[];
  isAttachmentSheetOpen: boolean;
  setIsAttachmentSheetOpen: (value: boolean) => void;
}
