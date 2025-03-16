// src/api/services/customData.ts

import { CustomField } from '@/types/customData';
import { HttpClient } from './HttpClient';

const API_URL = '/custom-field';

export interface GetAllCustomDataResponse {
    success: string;
    message: string;
    data?: CustomField[];
}

export interface CreateCustomDataResponse {
    success: string;
    message: string;
    data?: CustomField;
}

export interface UpdateCustomDataResponse {
    success: string;
    message: string;
    data?: {
        success: true
    };
}

export interface DeleteCustomDataResponse {
    success: string;
    message: string;
    data?: {
        success: true
    };
}

export const customDataService = {
    async getAllCustomData(table: string | null = null): Promise<CustomField[]> {
        try {
            const response = await HttpClient.apiClient.get<GetAllCustomDataResponse>(`${API_URL}${table ? `?table=${table}` : ''}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching canned responses:', error);
            throw new Error('Failed to fetch canned responses');
        }
    },

    async createCustomData(data: Omit<CustomField, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreateCustomDataResponse> {
        try {
            const response = await HttpClient.apiClient.post(`${API_URL}`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating canned response:', error);

            return {
                success: 'error',
                message: error?.message ?? 'Failed to create Custom Data'
            }
        }
    },


    async updateCustomData(data: Partial<CustomField>, customDataId: string): Promise<UpdateCustomDataResponse> {
        try {
            const response = await HttpClient.apiClient.put<UpdateCustomDataResponse>(`${API_URL}/${customDataId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating canned response:', error);

            return {
                success: 'error',
                message: error?.message ?? 'Failed to updating Custom Data'
            }
        }
    },

    async deleteCustomData(id: string): Promise<DeleteCustomDataResponse> {
        try {
            const response = await HttpClient.apiClient.delete<DeleteCustomDataResponse>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting domain:', error);
            throw new Error('Failed to delete domain');
        }
    },
};