// src/api/services/customObject.service.ts

import { HttpClient } from './HttpClient';
import { CustomObject, CustomObjectField } from '@/types/customObject';

const API_URL = '/custom-object';

export interface GetAllCustomObjectsResponse {
    status: string;
    message: string;
    data: (CustomObject & { fields_count: { count: number }[] })[];
}

export interface CreateCustomObjectResponse {
    status: string;
    message: string;
    data: [CustomObject];
}

export interface UpdateCustomObjectResponse {
    status: string;
    message: string;
    data: {
        success: true
    };
}

export interface DeleteCustomObjectResponse {
    status: string;
    message: string;
    data: {
        success: true
    };
}

export interface GetCustomObjectByIdResponse {
    status: string;
    message: string;
    data: CustomObject;
}

export interface CreateCustomObjectFieldResponse {
    status: string;
    message: string;
    data: CustomObjectField[];
}

export interface UpdateCustomObjectFieldResponse {
    status: string;
    message: string;
    data: {
        success: true
    };
}

export interface DeleteCustomObjectFieldResponse {
    status: string;
    message: string;
    data: {
        success: true
    };
}

export const customObjectService = {
    async getAllCustomObjects(): Promise<GetAllCustomObjectsResponse> {
        try {
            const response = await HttpClient.apiClient.get<GetAllCustomObjectsResponse>(`${API_URL}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching custom objects:', error);
            throw new Error('Failed to fetch custom objects');
        }
    },
    async createCustomObject(customObject: CustomObject): Promise<CreateCustomObjectResponse> {
        try {
            const response = await HttpClient.apiClient.post<CreateCustomObjectResponse>(`${API_URL}`, customObject);
            return response.data;
        } catch (error) {
            console.error('Error creating custom object:', error);
            throw new Error('Failed to create custom object');
        }
    },
    async updateCustomObject(customObjectId: string, updatedFields: Partial<CustomObject>): Promise<UpdateCustomObjectResponse> {
        try {
            const response = await HttpClient.apiClient.patch<UpdateCustomObjectResponse>(`${API_URL}/${customObjectId}`, updatedFields);
            return response.data;
        } catch (error) {
            console.error('Error updating custom object:', error);
            throw new Error('Failed to update custom object');
        }
    },
    async deleteCustomObject(customObject: CustomObject): Promise<DeleteCustomObjectResponse> {
        try {
            const response = await HttpClient.apiClient.delete<DeleteCustomObjectResponse>(`${API_URL}/${customObject.id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting custom object:', error);
            throw new Error('Failed to delete custom object');
        }
    },
    async getCustomObjectById(customObjectId: string): Promise<GetCustomObjectByIdResponse> {
        try {
            const response = await HttpClient.apiClient.get<GetCustomObjectByIdResponse>(`${API_URL}/${customObjectId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching custom object by ID:', error);
            throw new Error('Failed to fetch custom object by ID');
        }
    },
    async createCustomObjectField(customObjectId: string, customObjectField: Omit<CustomObjectField, "id" | "createdAt" | "updatedAt">): Promise<CreateCustomObjectFieldResponse> {
        try {
            const response = await HttpClient.apiClient.put<CreateCustomObjectFieldResponse>(`${API_URL}/${customObjectId}/add-new-field`, customObjectField);
            return response.data;
        } catch (error) {
            console.error('Error creating custom object field:', error);
            throw new Error('Failed to create custom object field');
        }
    },
    async updateCustomObjectField(customObjectId: string, customObjectField: Partial<CustomObjectField> & { fieldId: string }): Promise<UpdateCustomObjectFieldResponse> {
        try {
            const response = await HttpClient.apiClient.patch<UpdateCustomObjectFieldResponse>(`${API_URL}/${customObjectId}/update-field`, customObjectField);
            return response.data;
        } catch (error) {
            console.error('Error updating custom object field:', error);
            throw new Error('Failed to update custom object field');
        }
    },
    async deleteCustomObjectField(customObjectId: string, customObjectFieldId: string): Promise<DeleteCustomObjectFieldResponse> {
        try {
            const data = {
                fieldId: customObjectFieldId
            }
            const response = await HttpClient.apiClient.delete<DeleteCustomObjectFieldResponse>(`${API_URL}/${customObjectId}/delete-field`, { data });
            return response.data;
        } catch (error) {
            console.error('Error deleting custom object field:', error);
            throw new Error('Failed to delete custom object field');
        }
    }

};