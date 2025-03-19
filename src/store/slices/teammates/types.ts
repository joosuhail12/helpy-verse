
import type { Teammate, ActivityLog, TeamAssignment } from '@/types/teammate';

export interface TeammatesState {
  teammates: Teammate[];
  activityLogs: ActivityLog[];
  assignments: TeamAssignment[];
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  retryCount: number;
}

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
