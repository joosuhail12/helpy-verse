
import type { Teammate, ActivityLog, TeamAssignment } from '@/types/teammate';

export interface TeammatesState {
  teammates: Teammate[]; // Add missing property
  items: Teammate[];
  activityLogs: ActivityLog[];
  assignments: TeamAssignment[];
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  retryCount: number;
  selectedTeammateId?: string;
  sessions: any[]; // Add missing property
}

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
