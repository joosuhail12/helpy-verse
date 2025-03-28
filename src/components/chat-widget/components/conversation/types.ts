
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
  metadata?: Record<string, any>;
}

export interface MessageInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  placeholder?: string;
  disabled?: boolean;
  attachments?: File[];
  onFileUpload?: (files: File[]) => void;
  onRemoveFile?: (file: File) => void;
  showAttachments?: boolean;
  compact?: boolean;
  onHeightChange?: (height: number) => void;
  encrypted?: boolean;
}

export interface ChatAvatarProps {
  name: string;
  status?: 'online' | 'offline' | 'away';
  size?: 'sm' | 'md' | 'lg';
  src?: string;
}
