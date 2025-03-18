
export interface ContentTag {
  id: string;
  name: string;
  color: string;
}

export interface ContentComment {
  id: string;
  contentId: string;
  text: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface ContentVersion {
  id: string;
  contentId: string;
  content: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar: string;
  };
  changes: string;
}

export type ContentStatus = 'completed' | 'processing' | 'queued' | 'failed' | 'active' | 'inactive' | 'draft';

export interface Content {
  id: string;
  title: string;
  description: string;
  content?: string;
  type: 'snippet' | 'file' | 'website';
  status: ContentStatus;
  category: string;
  tags: ContentTag[];
  chatbots: { id: string; name: string }[];
  createdAt: string;
  lastUpdated: string;
  lastEditedBy?: {
    id: string;
    name: string;
    avatar: string;
  };
  messageCount: number;
  versions?: ContentVersion[];
  comments?: ContentComment[];
  sharedWith?: {
    id: string;
    name: string;
    avatar: string;
    role: 'editor' | 'viewer';
  }[];
}
