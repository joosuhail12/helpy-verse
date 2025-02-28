
import type { Teammate, ActivityLog, TeamAssignment, Session } from '@/types/teammate';

export interface TeammatesState {
  teammates: Teammate[];
  selectedTeammate: Teammate | null;
  activities: Record<string, ActivityLog[]>;
  assignments: Record<string, TeamAssignment[]>;
  sessions: Record<string, Session[]>;
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  retryCount: number; 
  teammatesDetails: Teammate | null;
}

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
