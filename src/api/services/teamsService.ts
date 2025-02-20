//teamsService.js

import { Team } from '@/types/team';
import { HttpClient } from './HttpClient';


const API_URL = '/team';

export interface TeamsResponse {
    data: Team[];
}

export interface TeamResponse {
    data: Team
}

const teamsService = {
    //get teams
    async fetchTeams(): Promise<TeamsResponse> {
        try {
            const response = await HttpClient.apiClient.get<TeamsResponse>(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw new Error('Failed to fetch teams');
        }
    },
    //get team by id
    async getTeamById(id: string): Promise<TeamResponse> {
        try {
            const response = await HttpClient.apiClient.get<TeamResponse>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching team memberships:', error);
            throw new Error('Failed to fetch team memberships');
        }
    },
    //    async getTeamById(id): (id) => HttpClient.apiClient.get(`${API_URL}/${id}`),

    //create team
    createTeam: (team) => HttpClient.apiClient.post(API_URL, team),

    //update team
    updateTeam: (id, team) => HttpClient.apiClient.put(`${API_URL}/${id}`, team),

    //delete team
    deleteTeam: (id) => HttpClient.apiClient.delete(`${API_URL}/${id}`),
};

export default teamsService;




