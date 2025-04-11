import { HttpClient } from './HttpClient';
import type { Ticket } from '@/types/ticket';

const API_URL = '/ticket';

export interface UpdateTicketResponse {
    status: string;
    message: string;
    data: Ticket;
}

export interface GetTicketResponse {
    status: string;
    message: string;
    data: Ticket;
}

export const ticketService = {
    // Helper method to get a ticket's sno
    async getTicketSno(ticketId: string): Promise<string> {
        try {
            const response = await this.fetchTicket(ticketId);
            // Check both possible locations for sno field based on API response
            if (response?.data?.sno) {
                return response.data.sno;
            } else if (response?.sno) {
                return response.sno;
            }
            return ticketId; // Fall back to using the ID if sno isn't available
        } catch (error) {
            console.error('Error getting ticket sno:', error);
            return ticketId; // Fall back to using the ID if there's an error
        }
    },

    // Direct method to get a ticket's sno without fetching the whole ticket
    async getSno(ticketId: string): Promise<string> {
        try {
            const response = await HttpClient.apiClient.get<GetTicketResponse>(
                `${API_URL}/${ticketId}`
            );

            // Extract the sno from the response
            const snoValue = response.data?.data?.sno;

            if (snoValue) {
                // Convert to string since the API returns it as a number
                return String(snoValue);
            }

            return ticketId; // Fall back to using the ID if sno isn't available
        } catch (error) {
            console.error('Error getting ticket sno:', error);
            return ticketId; // Fall back to using the ID if there's an error
        }
    },

    // ✅ Get ticket details
    async fetchTicket(ticketId: string): Promise<GetTicketResponse> {
        try {
            const response = await HttpClient.apiClient.get<GetTicketResponse>(
                `${API_URL}/${ticketId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching ticket:', error);
            throw new Error('Failed to fetch ticket');
        }
    },

    // ✅ Update a ticket
    async updateTicket(ticket_sno: string | number | { id?: string, sno?: number } | null, ticketData: Partial<Ticket>): Promise<UpdateTicketResponse> {
        let finalSno = '';

        try {
            // Remove workspace_id and other unused fields from the body
            const {
                workspace_id,
                id,
                ticket_sno: ticketSno,
                sno,
                hasNotification,
                isUnread,
                assigneeAvatar,
                categories,
                notificationType,
                ...cleanedData
            } = ticketData as any;

            console.log(`Updating ticket with sno ${ticket_sno}`, cleanedData);

            // Ensure ticket_sno is not an object
            finalSno = typeof ticket_sno === 'object' && ticket_sno !== null
                ? (ticket_sno.sno ? String(ticket_sno.sno) : String(ticket_sno.id || ''))
                : String(ticket_sno || '');

            if (!finalSno) {
                throw new Error('Invalid ticket identifier');
            }

            // Log the full request details for debugging
            console.log(`Making PUT request to ${API_URL}/${finalSno} with data:`, cleanedData);

            const response = await HttpClient.apiClient.put<UpdateTicketResponse>(
                `${API_URL}/${finalSno}`,
                cleanedData
            );

            // Log successful response
            console.log('Update ticket response:', response.data);

            // Validate response format
            if (!response.data || !response.data.data) {
                console.error('Invalid response structure:', response.data);
                throw new Error('Invalid response from server');
            }

            return response.data;
        } catch (error: any) {
            // Enhanced error logging
            console.error(`Error updating ticket with sno ${finalSno}:`, error);

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
                console.error('Response headers:', error.response.headers);

                // If we get a 404, the sno might be wrong
                if (error.response.status === 404) {
                    throw new Error(`Ticket with identifier ${finalSno} not found. Try again with the ID instead.`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received. Request details:', error.request);
                throw new Error('No response received from server. Check your network connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', error.message);
            }

            // Use the error message from the API if available
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update ticket';
            throw new Error(errorMessage);
        }
    },

    // ✅ Get ticket details by SNo
    async fetchTicketBySno(sno: string | number): Promise<GetTicketResponse> {
        try {
            console.log(`Making GET request to ${API_URL}/${sno}`);
            const response = await HttpClient.apiClient.get<GetTicketResponse>(
                `${API_URL}/${sno}`
            );
            return response.data;
        } catch (error) {
            console.error(`Error fetching ticket with SNo ${sno}:`, error);
            throw new Error(`Failed to fetch ticket with SNo ${sno}`);
        }
    }
}; 