
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
  status: 'active' | 'inactive' | 'draft' | 'processing' | 'queued' | 'completed' | 'failed';
  contentType: string;
  category: string;
  createdAt: string;
  lastUpdated: string;
  author: User;
  chatbots?: string[];
  tags?: ContentTag[];
  sharedWith?: User[];
  comments?: ContentComment[];
  versions?: ContentVersion[];
  lastEditedBy?: User;
  content?: string;
  type?: 'snippet' | 'file' | 'website';
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
  sortBy: {
    field: SortField;
    direction: 'asc' | 'desc';
  };
  filters: Record<string, any>;
  selectedContents: string[];
  searchQuery: string;
  lastFetchTime: number | null;
}

export type SortField = 
  | 'title'
  | 'createdAt'
  | 'lastUpdated'
  | 'status'
  | 'category'
  | 'author';
