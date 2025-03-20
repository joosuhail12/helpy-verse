// src/api/services/emailChannels.service.ts

import { HttpClient } from './HttpClient';
import { EmailChannel } from '@/types/emailChannel';

const API_URL = '/email-channels';

export interface GetAllEmailChannelsResponse {
    status: string;
    message: string;
    data: {
        emailChannels: EmailChannel[];
        doesUserHaveVerifiedDomain: boolean
    }
}

export interface CreateEmailChannelResponse {
    status: string;
    message: string;
    data: [EmailChannel];
}

export interface UpdateEmailChannelResponse {
    status: string;
    message: string;
    data: [EmailChannel];
}

export interface DeleteEmailChannelResponse {
    status: string;
    message: string;
    data: {
        success: true
    };
}

export interface GetEmailChannelByIdResponse {
    status: string;
    message: string;
    data: EmailChannel;
}

export const emailChannelsService = {
    async getAllEmailChannels(): Promise<GetAllEmailChannelsResponse> {
        try {
            const response = await HttpClient.apiClient.get<GetAllEmailChannelsResponse>(`${API_URL}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching email channels:', error);
            return {
                status: 'error',
                message: 'Failed to fetch email channels',
                data: {
                    emailChannels: [],
                    doesUserHaveVerifiedDomain: false
                },
            };
        }
    },
    async createEmailChannel(emailChannel: EmailChannel): Promise<CreateEmailChannelResponse> {
        try {
            const response = await HttpClient.apiClient.post<CreateEmailChannelResponse>(`${API_URL}`, emailChannel);
            return response.data;
        } catch (error) {
            console.error('Error creating email channel:', error);
            throw new Error('Failed to create email channel');
        }
    },
    async updateEmailChannel(emailChannelId: string, updatedFields: Partial<EmailChannel>): Promise<UpdateEmailChannelResponse> {
        try {
            const response = await HttpClient.apiClient.patch<UpdateEmailChannelResponse>(`${API_URL}/${emailChannelId}`, updatedFields);
            return response.data;
        } catch (error) {
            console.error('Error updating email channel:', error);
            throw new Error('Failed to update email channel');
        }
    },
    async deleteEmailChannel(emailChannelId: string): Promise<DeleteEmailChannelResponse> {
        try {
            const response = await HttpClient.apiClient.delete<DeleteEmailChannelResponse>(`${API_URL}/${emailChannelId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting email channel:', error);
            throw new Error('Failed to delete email channel');
        }
    },
    async getEmailChannelById(emailChannelId: string): Promise<GetEmailChannelByIdResponse> {
        try {
            const response = await HttpClient.apiClient.get<GetEmailChannelByIdResponse>(`${API_URL}/${emailChannelId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching email channel by ID:', error);
            throw new Error('Failed to fetch email channel by ID');
        }
    },
};