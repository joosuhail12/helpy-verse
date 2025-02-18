
export type ContentStatus = 'processing' | 'completed' | 'failed' | 'queued';
export type ContentType = 'file' | 'snippet' | 'website';

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
  chatbot?: {
    id: string;
    name: string;
  };
}
