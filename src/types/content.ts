
export type ContentStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'active' | 'inactive' | 'draft';

export type SortField = 'title' | 'lastUpdated' | 'messageCount';

export interface Content {
  id: string;
  title: string;
  description: string;
  contentType: 'file' | 'website' | 'snippet';
  status: ContentStatus;
  category: string;
  lastUpdated: string;
  createdAt: string;
  messageCount: number;
  chatbots?: Array<{ id: string; name: string }>;
  tags?: string[];
  createdBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface ContentState {
  items: Content[];
  selectedIds: string[];
  filters: {
    status: ContentStatus | null;
    category: string | null;
    chatbot: string | null;
  };
  sort: {
    field: SortField;
    direction: 'asc' | 'desc';
  };
  search: {
    query: string;
    suggestions: string[];
    history: string[];
  };
  loading: boolean;
  error: string | null;
}
