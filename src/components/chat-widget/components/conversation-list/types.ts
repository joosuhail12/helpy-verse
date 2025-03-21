
export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  date: string;
  unread: boolean;
  status: 'resolved' | 'ongoing';
}

export interface ConversationListProps {
  onNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
}

export interface FilterState {
  searchTerm: string;
  statusFilter: 'all' | 'ongoing' | 'resolved';
}
