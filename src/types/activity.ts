
export type ActivityType = 'email' | 'ticket' | 'note' | 'call' | 'meeting';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  date: string;
  metadata?: {
    duration?: number;
    responseTime?: number;
    status?: string;
    category?: 'positive' | 'negative' | 'neutral';
  };
}

export interface InteractionMetrics {
  totalInteractions: number;
  averageResponseTime: number;
  mostFrequentType: ActivityType;
  lastInteraction: string;
}
