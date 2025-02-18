
export type ContentStatus = 'processing' | 'completed' | 'failed' | 'queued';
export type ContentType = 'file' | 'snippet' | 'website';

export interface ContentVersion {
  id: string;
  contentId: string;
  content: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  changes: string;
}

export interface ContentComment {
  id: string;
  contentId: string;
  text: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
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
  type: ContentType;
  lastUpdated: string;
  messageCount: number;
  progress?: number;
  errorMessage?: string;
  content?: string;
  chatbots?: {
    id: string;
    name: string;
  }[];
  lastEditedBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
  versions?: ContentVersion[];
  tags?: ContentTag[];
  comments?: ContentComment[];
  sharedWith?: {
    id: string;
    name: string;
    avatar?: string;
  }[];
}
