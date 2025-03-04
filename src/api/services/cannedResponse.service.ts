// src/api/services/cannedResponse.ts

import { HttpClient } from './HttpClient';
import { CannedResponse, CreateCannedResponse } from '@/types/cannedResponse';

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
            throw new Error('Failed to create canned response');
        }
    },

    // async deleteDomain(id: string): Promise<DeleteDomainResponse> {
    //     try {
    //         const response = await HttpClient.apiClient.delete<DeleteDomainResponse>(`${API_URL}/${id}`);
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error deleting domain:', error);
    //         throw new Error('Failed to delete domain');
    //     }
    // },

    // async getSingleDomainDetails(id: string): Promise<DomainDetailsResponse> {
    //     try {
    //         const response = await HttpClient.apiClient.get<DomainDetailsResponse>(`${API_URL}/${id}`);
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error fetching domain details:', error);
    //         throw new Error('Failed to fetch domain details');
    //     }
    // },

    // async verifyDomain(id: string): Promise<DomainDetailsResponse> {
    //     try {
    //         const response = await HttpClient.apiClient.post<DomainDetailsResponse>(`${API_URL}/${id}`);
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error verifying domain:', error);
    //         throw new Error('Failed to verify domain');
    //     }
    // }
};