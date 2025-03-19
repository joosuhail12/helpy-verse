
import { apiService } from './apiService';
import { mockTeammates, mockActivityLogs, mockAssignments } from '@/store/slices/teammates/mockData';
import type { Teammate, ActivityLog, TeamAssignment, Session, NewTeammate } from '@/types/teammate';

// Endpoint for teammates
const ENDPOINT = '/teammates';

// Define whether to use mock data or real API
const USE_MOCK = true; // Set to false when backend is ready

/**
 * Teammate API Service
 */
export const teammateService = {
  /**
   * Get all teammates
   */
  async getTeammates(): Promise<Teammate[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      return mockTeammates;
    }
    return apiService.get<Teammate[]>(ENDPOINT);
  },

  /**
   * Get a single teammate by ID
   */
  async getTeammate(id: string): Promise<Teammate> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const teammate = mockTeammates.find(t => t.id === id);
      if (!teammate) throw new Error(`Teammate with ID ${id} not found`);
      return teammate;
    }
    return apiService.get<Teammate>(`${ENDPOINT}/${id}`);
  },

  /**
   * Create a new teammate
   */
  async createTeammate(data: NewTeammate): Promise<Teammate> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newTeammate: Teammate = {
        id: Math.random().toString(36).substring(2, 9),
        name: data.name,
        email: data.email,
        role: data.role,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        permissions: [],
        teams: [],
        is2FAEnabled: false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`
      };
      return newTeammate;
    }
    return apiService.post<Teammate>(ENDPOINT, data);
  },

  /**
   * Update a teammate
   */
  async updateTeammate(id: string, data: Partial<Teammate>): Promise<Teammate> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        ...mockTeammates.find(t => t.id === id)!,
        ...data,
        updatedAt: new Date().toISOString()
      };
    }
    return apiService.put<Teammate>(`${ENDPOINT}/${id}`, data);
  },

  /**
   * Delete a teammate
   */
  async deleteTeammate(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return { success: true };
    }
    return apiService.delete<{ success: boolean }>(`${ENDPOINT}/${id}`);
  },

  /**
   * Get activity logs for a teammate
   */
  async getTeammateActivityLogs(teammateId: string): Promise<ActivityLog[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 700));
      // Create some dynamic activity logs based on the mockActivityLogs
      return mockActivityLogs.map(log => ({
        ...log,
        teammateId,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }));
    }
    return apiService.get<ActivityLog[]>(`${ENDPOINT}/${teammateId}/activity`);
  },

  /**
   * Get team assignments for a teammate
   */
  async getTeammateAssignments(teammateId: string): Promise<TeamAssignment[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      // Add teammateId to the assignments
      return mockAssignments.map(assignment => ({
        ...assignment,
        teammateId
      }));
    }
    return apiService.get<TeamAssignment[]>(`${ENDPOINT}/${teammateId}/assignments`);
  },

  /**
   * Get sessions for a teammate
   */
  async getTeammateSessions(teammateId: string): Promise<Session[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Generate mock sessions
      return [
        {
          id: '1',
          deviceType: 'Desktop',
          deviceName: 'Chrome on Windows',
          location: 'New York, USA',
          ip: '192.168.1.1',
          lastActive: new Date().toISOString(),
          current: true
        },
        {
          id: '2',
          deviceType: 'Mobile',
          deviceName: 'Safari on iPhone',
          location: 'Chicago, USA',
          ip: '192.168.1.2',
          lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          current: false
        }
      ];
    }
    return apiService.get<Session[]>(`${ENDPOINT}/${teammateId}/sessions`);
  },

  /**
   * Terminate a session
   */
  async terminateSession(teammateId: string, sessionId: string): Promise<{ success: boolean }> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true };
    }
    return apiService.delete<{ success: boolean }>(`${ENDPOINT}/${teammateId}/sessions/${sessionId}`);
  },

  /**
   * Reset teammate password
   */
  async resetPassword(teammateId: string): Promise<{ success: boolean }> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    }
    return apiService.post<{ success: boolean }>(`${ENDPOINT}/${teammateId}/reset-password`);
  },

  /**
   * Resend invitation
   */
  async resendInvitation(teammateId: string): Promise<{ success: boolean }> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 900));
      return { success: true };
    }
    return apiService.post<{ success: boolean }>(`${ENDPOINT}/${teammateId}/resend-invitation`);
  }
};
