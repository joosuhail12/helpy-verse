
export type ContentStatus = 'completed' | 'processing' | 'queued' | 'failed' | 'active' | 'inactive' | 'draft';
export type SortField = 'title' | 'lastUpdated' | 'messageCount';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Chatbot {
  id: string;
  name: string;
}

export interface ContentComment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface ContentVersion {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  changeDescription?: string;
}

export interface ContentTag {
  id: string;
  name: string;
  color: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ContentStatus;
  messageCount: number;
  lastUpdated: string;
  createdAt: string;
  chatbots?: Chatbot[];
  
  // Additional properties
  contentType?: 'article' | 'faq' | 'guide';
  tags?: ContentTag[];
  content?: string;
  versions?: ContentVersion[];
  comments?: ContentComment[];
  lastEditedBy?: User;
  sharedWith?: User[];
}

export interface ContentState {
  items: Content[];
  loading: boolean;
  error: string | null;
  selectedContentId: string | null;
  selectedContent: Content | null;
  statusFilter: string | null;
  categoryFilter: string | null;
  chatbotFilter: string | null;
  sort: {
    field: SortField;
    direction: 'asc' | 'desc';
  };
  filters: {
    status: string | null;
    category: string | null;
    chatbot: string | null;
  };
  selectedIds: string[];
  searchQuery: string;
  lastFetchTime: number | null;
  search: {
    query: string;
    suggestions: string[];
    history: string[];
  };
}
