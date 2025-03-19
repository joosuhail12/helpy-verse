
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
  changeDescription?: string;
  changes?: { field: string; from: string; to: string }[];
}

export interface ContentComment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  updatedAt?: string;
  reactions?: { emoji: string; count: number }[];
}

export type ContentType = 'article' | 'faq' | 'guide' | 'email' | 'knowledgebase' | 'checklist' | 'calculator' | 'product' | 'code' | 'docs' | 'security' | 'analytics';

export interface Content {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: string;
  type: ContentType;
  status: 'draft' | 'published' | 'archived' | 'review';
  createdAt: string;
  updatedAt: string;
  lastUpdated?: string;
  author: User;
  lastEditedBy?: User;
  versions?: ContentVersion[];
  comments?: ContentComment[];
  tags?: string[];
  url?: string;
}

export interface FilePreviewProps {
  file: string;
}

export interface WebsitePreviewProps {
  website: string;
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
  contentId: string;
}
