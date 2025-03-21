
export type WidgetPage = 'home' | 'conversations' | 'new-chat' | 'conversation-detail';

export interface NavigationBarProps {
  currentPage: WidgetPage;
  navigateTo: (page: WidgetPage) => void;
}

export interface WidgetHeaderProps {
  currentPage: WidgetPage;
  navigateTo: (page: WidgetPage) => void;
  toggleWidget: () => void;
}

export interface WidgetContentProps {
  currentPage: WidgetPage;
  currentConversationId: string | null;
  navigateTo: (page: WidgetPage) => void;
  handleSelectConversation: (conversationId: string) => void;
  handleConversationCreated: (conversationId?: string) => void;
  workspaceId?: string;
}
