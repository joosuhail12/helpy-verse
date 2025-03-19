
export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  role?: 'admin' | 'editor' | 'viewer';
}

export interface ContentVersion {
  id: string;
  contentId?: string;
  content: string;
  createdAt: string;
  user?: User;
  createdBy?: User;
  changeDescription?: string;
  changes?: string | { field: string; from: string; to: string; }[];
}

export interface ContentComment {
  id: string;
  contentId?: string;
  content?: string;
  text?: string;
  createdAt: string;
  user?: User;
  createdBy?: User;
}

export interface ContentTag {
  id: string;
  name: string;
  color: string;
}

export type ContentStatus = 
  | 'active' 
  | 'inactive' 
  | 'draft' 
  | 'published'
  | 'archived'
  | 'review'
  | 'processing' 
  | 'queued' 
  | 'completed' 
  | 'failed';

export type ContentType = 
  | 'article'
  | 'faq'
  | 'guide'
  | 'snippet'
  | 'file'
  | 'website';

export interface Content {
  id: string;
  title: string;
  description: string;
  status: ContentStatus;
  contentType?: string;
  type?: ContentType;
  category: string;
  createdAt: string;
  lastUpdated: string;
  author: User;
  chatbots?: Array<{ id: string; name: string }>;
  tags?: ContentTag[];
  sharedWith?: User[];
  comments?: ContentComment[];
  versions?: ContentVersion[];
  lastEditedBy?: User;
  content?: string;
  messageCount?: number;
  progress?: number;
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
    status: ContentStatus | null;
    category: string | null;
    chatbot: string | null;
  };
  selectedIds: string[];
  searchQuery: string;
  lastFetchTime: number | null;
  search?: {
    query: string;
    suggestions: string[];
    history: string[];
  };
}

export type SortField = 
  | 'title'
  | 'createdAt'
  | 'lastUpdated'
  | 'status'
  | 'category'
  | 'author'
  | 'messageCount';

export interface WebsitePreviewProps {
  website?: string;
  url?: string;
}

export interface FilePreviewProps {
  file?: string;
  url?: string;
}

export interface ContentFormProps {
  content: Content;
  onUpdate: (updates: Partial<Content>) => void;
  categories: { id: string; name: string }[];
  currentUser: User;
}

export interface ContentCommentsProps {
  contentId: string;
}

export interface ContentPreviewProps {
  content: Content;
  onRestore: (version: ContentVersion) => void;
  currentUser: User;
}
