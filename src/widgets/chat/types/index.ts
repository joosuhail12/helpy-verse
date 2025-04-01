
export type View = 'home' | 'messages' | 'conversation';

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp: Date | string;
  unreadCount: number;
  type?: string;
}
