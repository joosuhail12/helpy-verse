
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface ContentVersion {
  id?: string;
  content: string;
  createdAt: string;
  user: User;
  createdBy?: User;
  changeDescription?: string;
  changes?: { field: string; from: string; to: string }[];
}

export interface ContentComment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  updatedAt?: string;
  createdBy?: User;
  text?: string; // Alias for content in some contexts
  reactions?: { emoji: string; count: number }[];
}

export type ContentType = 
  | 'article' 
  | 'faq' 
  | 'guide' 
  | 'email' 
  | 'knowledgebase' 
  | 'checklist' 
  | 'calculator' 
  | 'product' 
  | 'code' 
  | 'docs' 
  | 'security' 
  | 'analytics'
  | 'snippet'
  | 'file'
  | 'website';

export type ContentStatus = 
  | 'draft' 
  | 'published' 
  | 'archived' 
  | 'review'
  | 'active'
  | 'inactive'
  | 'processing'
  | 'queued'
  | 'completed'
  | 'failed';

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
  category: string;
  type: ContentType;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  lastUpdated?: string;
  author: User;
  lastEditedBy?: User;
  versions?: ContentVersion[];
  comments?: ContentComment[];
  tags?: (string | ContentTag)[];
  url?: string;
  contentType?: ContentType; // Alias for type in some contexts
  chatbots?: Array<{ id: string; name: string } | string>;
  messageCount?: number;
}

export interface FilePreviewProps {
  file: string;
  url?: string;
}

export interface WebsitePreviewProps {
  website: string;
  url?: string;
}

export interface ContentFormProps {
  content: Content;
  onUpdate: (content: Partial<Content>) => void;
  categories: string[];
  currentUser: User;
  isSubmitting?: boolean;
}

export interface ContentPreviewProps {
  content: Content;
  onRestore: (versionId: string) => void;
  currentUser: User;
}

export interface ContentCommentsProps {
  contentId?: string;
  comments?: ContentComment[];
  onAddComment?: (comment: Partial<ContentComment>) => void;
  currentUser?: User;
  content?: Content;
}

export type SortField = 'lastUpdated' | 'messageCount' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface ContentState {
  items: Content[];
  loading: boolean;
  error: string | null;
  selectedContentId: string | null;
  selectedContent: Content | null;
  statusFilter: string | null;
  categoryFilter: string | null;
  chatbotFilter: string | null;
  filters: {
    status: ContentStatus | null;
    category: string | null;
    chatbot: string | null;
  };
  sort: {
    field: SortField;
    direction: SortDirection;
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
