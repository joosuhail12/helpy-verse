
export type ContentStatus = 'completed' | 'processing' | 'queued' | 'failed' | 'active' | 'inactive' | 'draft';
export type SortField = 'title' | 'lastUpdated' | 'messageCount';

export interface Content {
  id: string;
  title: string;
  description: string;
  content?: string;
  status: ContentStatus;
  category?: string;
  tags?: string[];
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  chatbots?: {
    id: string;
    name: string;
  }[];
}

export interface ContentFilterState {
  status: ContentStatus | null;
  category: string | null;
  chatbot: string | null;
}

export interface ContentSortState {
  field: SortField;
  direction: 'asc' | 'desc';
}
