// src/api/services/teammatesService.ts

import { HttpClient } from "@/api/services/HttpClient";
import type { Teammate, NewTeammate } from "@/types/teammate";

const API_URL = '/user';

export interface TeammatesResponse {
    data: any;
    teammates: Teammate[];
    total: number;
}

export interface CreateTeammateResponse {
    data: Teammate[];
}

export interface UpdateTeammateResponse {
    data: Teammate;
}

export interface GetTeammateResponse {
    data: Teammate;
}

export const teammatesService = {
    async fetchTeammates(): Promise<TeammatesResponse> {
        try {
            const response = await HttpClient.apiClient.get<TeammatesResponse>(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching teammates:', error);
            throw new Error('Failed to fetch teammates');
        }
    },

    async createTeammate(teammate: NewTeammate): Promise<CreateTeammateResponse> {
        try {
            const response = await HttpClient.apiClient.post<CreateTeammateResponse>(API_URL, teammate);
            return response.data;
        } catch (error) {
            console.error('Error creating teammate:', error);
            throw new Error('Failed to create teammate');
        }
    },

    async updateTeammate(teammateId: string, teammate: Partial<Teammate>): Promise<UpdateTeammateResponse> {
        try {
            const response = await HttpClient.apiClient.put<UpdateTeammateResponse>(`${API_URL}/${teammateId}`, teammate);
            return response.data;
        } catch (error) {
            console.error('Error updating teammate:', error);
            throw new Error('Failed to update teammate');
        }
    },

    async getTeammate(teammateId: string): Promise<GetTeammateResponse> {
        try {
            const response = await HttpClient.apiClient.get<GetTeammateResponse>(`${API_URL}/${teammateId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching team memberships:', error);
            throw new Error('Failed to fetch team memberships');
        }
    },
};
