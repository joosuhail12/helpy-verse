
// src/api/services/teamService.ts

import { HttpClient } from './HttpClient';
import { Team, TeamNew } from '@/types/team';

const API_URL = '/team';

export interface GetAllTeamsResponse {
    message: string;
    status: string;
    data: TeamNew[];
}

export const teamsService = {
    async getAllTeams(): Promise<GetAllTeamsResponse> {
        try {
            const response = await HttpClient.apiClient.get<GetAllTeamsResponse>(`${API_URL}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw new Error('Failed to fetch teams');
        }
    },
}
