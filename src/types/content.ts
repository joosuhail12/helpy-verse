
export type ContentStatus = 'processing' | 'completed' | 'failed' | 'queued';

export interface Content {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ContentStatus;
  lastUpdated: string;
  messageCount: number;
  progress?: number;
  errorMessage?: string;
  chatbot?: {
    id: string;
    name: string;
  };
}

