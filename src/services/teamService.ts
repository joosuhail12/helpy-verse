
import { apiService } from './apiService';
import { mockTeams } from '@/store/slices/teams/mockData';
import type { Team, TeamMember, TimeSlot, Holiday, TeamChannel, TeamRouting } from '@/types/team';

// Endpoint for teams
const ENDPOINT = '/teams';

// Define whether to use mock data or real API
const USE_MOCK = true; // Set to false when backend is ready

// Create a fixed mock for routing
const mockTeamRouting: TeamRouting = {
  type: 'round-robin',
  limits: {
    maxTickets: 20,
    maxOpenTickets: 10,
    maxActiveChats: 5
  }
};

/**
 * Team API Service
 */
export const teamService = {
  /**
   * Get all teams
   */
  async getTeams(): Promise<Team[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add routing to mock teams
      return mockTeams.map(team => ({
        ...team,
        routing: [mockTeamRouting]
      }));
    }
    return apiService.get<Team[]>(ENDPOINT);
  },

  /**
   * Get a single team by ID
   */
  async getTeam(id: string): Promise<Team> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const team = mockTeams.find(t => t.id === id);
      if (!team) throw new Error(`Team with ID ${id} not found`);
      
      return {
        ...team,
        routing: [mockTeamRouting]
      };
    }
    return apiService.get<Team>(`${ENDPOINT}/${id}`);
  },

  /**
   * Create a new team
   */
  async createTeam(data: Partial<Team>): Promise<Team> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTeam: Team = {
        id: Math.random().toString(36).substring(2, 9),
        name: data.name || 'New Team',
        icon: data.icon || '🏢',
        description: data.description || '',
        status: data.status || 'active',
        memberCount: (data.members?.length || 0),
        members: data.members || [],
        officeHours: data.officeHours || {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: []
        },
        channels: data.channels || [],
        routing: [mockTeamRouting],
        holidays: data.holidays || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return newTeam;
    }
    return apiService.post<Team>(ENDPOINT, data);
  },

  /**
   * Update a team
   */
  async updateTeam(id: string, data: Partial<Team>): Promise<Team> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const team = mockTeams.find(t => t.id === id);
      if (!team) throw new Error(`Team with ID ${id} not found`);
      
      return {
        ...team,
        ...data,
        routing: [mockTeamRouting],
        updatedAt: new Date().toISOString()
      };
    }
    return apiService.put<Team>(`${ENDPOINT}/${id}`, data);
  },

  /**
   * Delete a team
   */
  async deleteTeam(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return { success: true };
    }
    return apiService.delete<{ success: boolean }>(`${ENDPOINT}/${id}`);
  },

  /**
   * Update team routing
   */
  async updateTeamRouting(teamId: string, routing: TeamRouting): Promise<Team> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const team = mockTeams.find(t => t.id === teamId);
      if (!team) throw new Error(`Team with ID ${teamId} not found`);
      
      return {
        ...team,
        routing: [routing],
        updatedAt: new Date().toISOString()
      };
    }
    return apiService.put<Team>(`${ENDPOINT}/${teamId}/routing`, { routing });
  },

  /**
   * Update team office hours
   */
  async updateTeamOfficeHours(teamId: string, officeHours: {
    monday?: TimeSlot[];
    tuesday?: TimeSlot[];
    wednesday?: TimeSlot[];
    thursday?: TimeSlot[];
    friday?: TimeSlot[];
    saturday?: TimeSlot[];
    sunday?: TimeSlot[];
    timezone?: string;
  }): Promise<Team> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const team = mockTeams.find(t => t.id === teamId);
      if (!team) throw new Error(`Team with ID ${teamId} not found`);
      
      return {
        ...team,
        officeHours,
        updatedAt: new Date().toISOString()
      };
    }
    return apiService.put<Team>(`${ENDPOINT}/${teamId}/office-hours`, { officeHours });
  }
};
