
import { BaseService } from './BaseService';
import type { Ticket } from '@/types/ticket';

interface TicketsResponse {
  data: Ticket[];
  total: number;
}

/**
 * Service for managing tickets
 */
export class TicketsService extends BaseService<Ticket, TicketsResponse> {
  protected endpoint = '/ticket';

  /**
   * Override getAll to handle pagination and filtering
   */
  async getAll(params?: Record<string, any>): Promise<TicketsResponse> {
    const response = await this.request<TicketsResponse>('get', this.endpoint, null, { params });
    return response.data;
  }

  /**
   * Assign ticket to team member
   */
  async assignTicket(ticketId: string, teammateId: string): Promise<Ticket> {
    const response = await this.request<Ticket>(
      'post',
      `${this.endpoint}/${ticketId}/assign`,
      { teammateId }
    );
    return response.data;
  }

  /**
   * Change ticket status
   */
  async changeStatus(
    ticketId: string, 
    status: 'open' | 'pending' | 'closed'
  ): Promise<Ticket> {
    const response = await this.request<Ticket>(
      'patch',
      `${this.endpoint}/${ticketId}/status`,
      { status }
    );
    return response.data;
  }

  /**
   * Add comment to ticket
   */
  async addComment(
    ticketId: string, 
    comment: string, 
    isInternal: boolean = false
  ): Promise<any> {
    const response = await this.request<any>(
      'post',
      `${this.endpoint}/${ticketId}/comments`,
      { content: comment, isInternal }
    );
    return response.data;
  }
}

// Export singleton instance
export const ticketsService = new TicketsService();
