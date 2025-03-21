import { HttpClient } from '@/api/services/http';
import type { Team, TeamCreatePayload, DayOfWeek, TimeSlot } from '@/types/team';

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

// Transform backend team data to frontend team model
const mapTeamFromBackend = (team: any): Team => {
    console.log('Mapping team from backend:', team);
    
    // Initialize office hours with a safe structure
    const defaultOfficeHours = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    };
    
    // Safely access office hours
    const officeHours = team.officeHours || defaultOfficeHours;
    
    // Ensure each day in officeHours has a valid array
    Object.keys(defaultOfficeHours).forEach(day => {
        if (!Array.isArray(officeHours[day])) {
            officeHours[day] = [];
        }
    });
    
    // Ensure channels has a valid structure
    const channels = team.channels || { email: [] };
    if (!channels.email) {
        channels.email = [];
    }
    
    return {
        id: team.id,
        name: team.name,
        icon: team.icon,
        description: team.description,
        teamMembers: Array.isArray(team.teamMembers) ? team.teamMembers : [],
        members: Array.isArray(team.members) ? team.members : [],
        channels: channels,
        routingStrategy: team.routingStrategy || 'manual',
        maxTotalTickets: team.maxTotalTickets,
        maxOpenTickets: team.maxOpenTickets,
        maxActiveChats: team.maxActiveChats,
        officeHours: officeHours,
        holidays: Array.isArray(team.holidays) ? team.holidays : [],
        createdAt: team.createdAt || team.created_at || '',
        updatedAt: team.updatedAt || team.updated_at || '',
        workspaceId: team.workspaceId,
        clientId: team.clientId,
        createdBy: team.createdBy
    };
};

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
            const response = await HttpClient.apiClient.get<{ data: any[] }>(API_URL, { params: queryParams });
            console.log('Teams response:', response.data);
            
            // Map backend data to frontend model
            const mappedTeams = response.data.data?.map(mapTeamFromBackend) || [];
            
            return {
                data: mappedTeams,
                total: mappedTeams.length
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
                ...(team.routing.limits?.maxTotalTickets !== undefined && { maxTotalTickets: team.routing.limits.maxTotalTickets }),
                ...(team.routing.limits?.maxOpenTickets !== undefined && { maxOpenTickets: team.routing.limits.maxOpenTickets }),
                ...(team.routing.limits?.maxActiveChats !== undefined && { maxActiveChats: team.routing.limits.maxActiveChats }),
                officeHours: team.officeHours,
                holidays: team.holidays,
                workspace_id: workspaceId
            };
            
            const response = await HttpClient.apiClient.post<{ data: any }>(API_URL, payload);
            return { data: mapTeamFromBackend(response.data.data) };
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
            if (team.icon !== undefined) payload.icon = team.icon;
            if (team.members) payload.members = team.members;
            
            // Handle channels properly
            if (team.channels) {
                payload.channels = {
                    chat: team.channels.chat,
                    email: Array.isArray(team.channels.email) ? team.channels.email : []
                };
            }
            
            // Handle routingStrategy and limits
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
            
            // Handle officeHours and holidays safely
            if (team.officeHours) {
                // Ensure all days exist in officeHours
                const defaultDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                const safeOfficeHours: any = {};
                
                defaultDays.forEach(day => {
                    safeOfficeHours[day] = Array.isArray(team.officeHours?.[day as DayOfWeek]) 
                        ? team.officeHours[day as DayOfWeek] 
                        : [];
                });
                
                payload.officeHours = safeOfficeHours;
            }
            
            if (team.holidays !== undefined) {
                payload.holidays = Array.isArray(team.holidays) ? team.holidays : [];
            }
            
            console.log('Sending team update payload:', payload);
            const response = await HttpClient.apiClient.put<{ data: any }>(`${API_URL}/${id}`, payload);
            console.log('Team update response:', response.data);
            return { data: mapTeamFromBackend(response.data.data) };
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
            
            const response = await HttpClient.apiClient.get<{ data: any }>(`${API_URL}/${id}`, {
                params: { workspace_id: workspaceId }
            });
            return { data: mapTeamFromBackend(response.data.data) };
        } catch (error) {
            console.error('Error fetching team:', error);
            throw new Error('Failed to fetch team details');
        }
    }
};
