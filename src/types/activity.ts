
export type ActivityType = 
  | 'email' 
  | 'ticket' 
  | 'note' 
  | 'call' 
  | 'meeting'
  | 'company_update';

export type ActivityMetadataCategory = 'positive' | 'negative' | 'neutral' | 'update';

export interface ActivityMetadata {
  category: ActivityMetadataCategory;
  responseTime?: number;
  status?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  date: string;
  metadata: ActivityMetadata;
  subject?: string;
  content?: string;
}

export interface InteractionMetrics {
  totalInteractions: number;
  averageResponseTime: number;
  mostFrequentType: ActivityType;
  lastInteraction: string;
}
