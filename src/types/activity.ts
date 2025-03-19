
export type ActivityType = 'email' | 'note' | 'call' | 'meeting' | 'message' | 'task' | 'ticket' | 'company_update';

export interface ActivityMetadata {
  subject?: string;
  content?: string;
  taskName?: string;
  status?: string;
  responseTime?: number;
  category?: string;
  [key: string]: any;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title?: string;
  description: string;
  timestamp: string;
  date: string; // Required field for timeline display
  user?: string;
  metadata: ActivityMetadata;
}

export interface InteractionMetrics {
  totalInteractions: number;
  averageResponseTime: number;
  mostFrequentType: ActivityType;
  lastInteraction: string;
}
