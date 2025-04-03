
export type ContentStatus = 'completed' | 'processing' | 'queued' | 'failed' | 'active' | 'inactive' | 'draft';
export type SortField = 'title' | 'lastUpdated' | 'messageCount';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role?: 'admin' | 'editor' | 'viewer';
}

export interface ContentVersion {
  id: string;
  contentId: string;
  content: string;
  createdAt: string;
  createdBy: User;
  changes: string;
}

export interface ContentComment {
  id: string;
  contentId: string;
  text: string;
  createdAt: string;
  createdBy: User;
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
  content?: string;
  status: ContentStatus;
  category?: string;
  contentType?: string;
  type?: 'snippet' | 'file' | 'website';
  tags?: string[] | ContentTag[];
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  chatbots?: {
    id: string;
    name: string;
  }[];
  versions?: ContentVersion[];
  comments?: ContentComment[];
  lastEditedBy?: User;
  sharedWith?: User[];
  author?: User;
  progress?: number;
  errorMessage?: string;
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
