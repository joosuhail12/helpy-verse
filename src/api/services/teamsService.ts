
import { HttpClient } from '@/api/services/http';
import type { Team, TeamCreatePayload } from '@/types/team';

// API endpoint for teams
const API_URL = '/team';

export interface TeamsResponse {
    data: Team[];
    total: number;
}

export interface TeamResponse {
    data: Team;
}

export interface TeamParams {
    searchQuery?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    workspace_id?: string;
}

export const teamsService = {
    async fetchTeams(params: TeamParams = {}): Promise<TeamsResponse> {
        try {
            // Get workspace ID from localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            // Ensure workspace_id is included in params
            const queryParams = {
                ...params,
                workspace_id: params.workspace_id || workspaceId
            };
            
            console.log('Fetching teams with params:', queryParams);
            const response = await HttpClient.apiClient.get<{ data: Team[] }>(API_URL, { params: queryParams });
            console.log('Teams response:', response.data);
            
            return {
                data: response.data.data || [],
                total: response.data.data?.length || 0
            };
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw new Error('Failed to fetch teams');
        }
    },

    async createTeam(team: TeamCreatePayload): Promise<TeamResponse> {
        try {
            // Get workspace ID from localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            // Format the payload according to the backend expectation
            const payload = {
                name: team.name,
                icon: team.icon,
                members: team.members,
                channels: team.channels,
                routingStrategy: team.routing.type,
                ...(team.routing.limits?.maxTotalTickets && { maxTotalTickets: team.routing.limits.maxTotalTickets }),
                ...(team.routing.limits?.maxOpenTickets && { maxOpenTickets: team.routing.limits.maxOpenTickets }),
                ...(team.routing.limits?.maxActiveChats && { maxActiveChats: team.routing.limits.maxActiveChats }),
                workspace_id: workspaceId
            };
            
            const response = await HttpClient.apiClient.post<{ data: Team }>(API_URL, payload);
            return { data: response.data.data };
        } catch (error) {
            console.error('Error creating team:', error);
            throw new Error('Failed to create team');
        }
    },

    async updateTeam(id: string, team: Partial<TeamCreatePayload>): Promise<TeamResponse> {
        try {
            // Get workspace ID from localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            // Format the payload according to the backend expectation
            const payload: any = {
                workspace_id: workspaceId
            };
            
            if (team.name) payload.name = team.name;
            if (team.icon) payload.icon = team.icon;
            if (team.members) payload.members = team.members;
            if (team.channels) payload.channels = team.channels;
            
            if (team.routing) {
                payload.routingStrategy = team.routing.type;
                
                if (team.routing.limits) {
                    if (team.routing.limits.maxTotalTickets !== undefined) {
                        payload.maxTotalTickets = team.routing.limits.maxTotalTickets;
                    }
                    if (team.routing.limits.maxOpenTickets !== undefined) {
                        payload.maxOpenTickets = team.routing.limits.maxOpenTickets;
                    }
                    if (team.routing.limits.maxActiveChats !== undefined) {
                        payload.maxActiveChats = team.routing.limits.maxActiveChats;
                    }
                }
            }
            
            const response = await HttpClient.apiClient.put<{ data: Team }>(`${API_URL}/${id}`, payload);
            return { data: response.data.data };
        } catch (error) {
            console.error('Error updating team:', error);
            throw new Error('Failed to update team');
        }
    },

    async deleteTeam(id: string): Promise<void> {
        try {
            // Get workspace ID from localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            await HttpClient.apiClient.delete(`${API_URL}/${id}`, {
                params: { workspace_id: workspaceId }
            });
        } catch (error) {
            console.error('Error deleting team:', error);
            throw new Error('Failed to delete team');
        }
    },
    
    async getTeam(id: string): Promise<TeamResponse> {
        try {
            // Get workspace ID from localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            const response = await HttpClient.apiClient.get<{ data: Team }>(`${API_URL}/${id}`, {
                params: { workspace_id: workspaceId }
            });
            return { data: response.data.data };
        } catch (error) {
            console.error('Error fetching team:', error);
            throw new Error('Failed to fetch team details');
        }
    }
};
