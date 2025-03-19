
import type { Teammate, ActivityLog, TeamAssignment, Session } from '@/types/teammate';

export interface TeammatesState {
  teammates: Teammate[]; 
  items: Teammate[];
  activityLogs: ActivityLog[];
  assignments: Record<string, TeamAssignment[]>;
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  retryCount: number;
  selectedTeammateId?: string;
  sessions: Record<string, Session[]>;
  activities: Record<string, ActivityLog[]>;
}

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
