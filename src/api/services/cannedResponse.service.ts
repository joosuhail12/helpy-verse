// src/api/services/cannedResponse.ts

import { HttpClient } from './HttpClient';
import { CannedResponse, CreateCannedResponse, UpdateCannedResponse } from '@/types/cannedResponse';

const API_URL = '/canned-response';

export interface CreateCannedResponseResponse {
    message: string;
    status: string;
}

export interface GetAllCannedResponses {
    message: string;
    status: string;
    data: CannedResponse[];
}

export interface GetCannedResponseDetail {
    message: string;
    status: string;
    data: CannedResponse;
}

export interface UpdateCannedResponseResponse {
    message: string;
    status: string;
}

export interface DeleteCannedResponse {
    message: string;
    status: string;
}


export const cannedResponseService = {
    async getCannedResponses(): Promise<GetAllCannedResponses> {
        try {
            const response = await HttpClient.apiClient.get<GetAllCannedResponses>(`${API_URL}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching canned responses:', error);
            throw new Error('Failed to fetch canned responses');
        }
    },

    async createCannedResponse(cannedResponse: CreateCannedResponse): Promise<CreateCannedResponseResponse> {
        try {
            const response = await HttpClient.apiClient.post<CreateCannedResponseResponse>(`${API_URL}`, cannedResponse);
            return response.data;
        } catch (error) {
            console.error('Error creating canned response:', error);
            return {
                status: 'error',
                message: error?.response?.data?.message ?? 'Failed to create canned response'
            }
        }
    },

    async getCannedResponseDetails(id: string): Promise<GetCannedResponseDetail> {
        try {
            const response = await HttpClient.apiClient.get<GetCannedResponseDetail>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching canned responses:', error);
            throw new Error('Failed to fetch canned responses');
        }
    },

    async updateCannedResponse(body: UpdateCannedResponse): Promise<UpdateCannedResponseResponse> {
        try {
            const response = await HttpClient.apiClient.patch<UpdateCannedResponseResponse>(`${API_URL}/${body.id}`, body);
            return response.data;
        } catch (error) {
            console.error('Error fetching canned responses:', error);
            throw new Error('Failed to fetch canned responses');
        }
    },

    async deleteCannedResponse(id: string): Promise<DeleteCannedResponse> {
        try {
            const response = await HttpClient.apiClient.delete<DeleteCannedResponse>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting domain:', error);
            throw new Error('Failed to delete domain');
        }
    },
};