import { HttpClient } from './HttpClient';

export interface Mention {
    id: string;
    ticketId: string;
    userId: string;
    mentionedBy: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    mentionedAt?: string;
    ticket?: {
        id: string;
        title: string;
        sno?: number;
        status: 'open' | 'closed' | 'pending';
        priority: 'low' | 'medium' | 'high' | number;
        createdAt: string;
        updatedAt: string;
        clientId: string;
        isUnread: boolean;
        hasNotification: boolean;
        notificationType?: string | null;
        customerId?: string;
        customer?: {
            id: string;
            name: string;
            email: string;
            phone?: string | null;
        }
    };
    mentioner?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface GetMentionsResponse {
    status: string;
    message: string;
    data: Mention[];
}

export interface CreateMentionResponse {
    status: string;
    message: string;
    data: Mention;
}

export interface UpdateMentionResponse {
    status: string;
    message: string;
    data: Mention;
}

const API_URL = '/mentions';

export const mentionsService = {
    // Get mentions for the current user
    async getMentions(params?: {
        ticket_id?: string;
        user_id?: string;
        status?: string;
        is_read?: boolean;
        skip?: number;
        limit?: number;
    }): Promise<GetMentionsResponse> {
        try {
            const response = await HttpClient.apiClient.get<GetMentionsResponse>(API_URL, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching mentions:', error);
            throw error;
        }
    },

    // Create a new mention
    async createMention(data: {
        ticketId: string;
        userId: string;
        mentionId?: string;
        mentionedBy?: string;
        content?: string;
    }): Promise<CreateMentionResponse> {
        try {
            const response = await HttpClient.apiClient.post<CreateMentionResponse>(API_URL, data);
            return response.data;
        } catch (error) {
            console.error('Error creating mention:', error);
            throw error;
        }
    },

    // Mark a mention as read
    async markMentionAsRead(mentionId: string): Promise<UpdateMentionResponse> {
        try {
            const response = await HttpClient.apiClient.put<UpdateMentionResponse>(
                `${API_URL}/${mentionId}/read`
            );
            return response.data;
        } catch (error) {
            console.error('Error marking mention as read:', error);
            throw error;
        }
    },

    // Update an existing mention
    async updateMention(mentionId: string, data: {
        content?: string;
        isRead?: boolean;
        ticketId?: string;
        userId?: string;
        mentionedBy?: string;
    }): Promise<UpdateMentionResponse> {
        try {
            const response = await HttpClient.apiClient.put<UpdateMentionResponse>(
                `${API_URL}/${mentionId}`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error updating mention:', error);
            throw error;
        }
    }
}; 