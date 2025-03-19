
export type ContentStatus = 'completed' | 'processing' | 'queued' | 'failed' | 'active' | 'inactive' | 'draft';
export type SortField = 'title' | 'lastUpdated' | 'messageCount';

export interface Chatbot {
  id: string;
  name: string;
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
