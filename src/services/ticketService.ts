
import { backendService } from './backendService';
import type { Ticket } from '@/types/ticket';

const ENDPOINT = '/tickets';

export const ticketService = {
  /**
   * Get all tickets with optional filtering
   * @param filters Optional filter parameters
   */
  async getTickets(filters?: Record<string, string>): Promise<Ticket[]> {
    return backendService.fetchData<Ticket[]>(ENDPOINT, filters);
  },

  /**
   * Get a specific ticket by ID
   * @param id Ticket ID
   */
  async getTicketById(id: string): Promise<Ticket> {
    return backendService.fetchData<Ticket>(`${ENDPOINT}/${id}`);
  },

  /**
   * Create a new ticket
   * @param ticketData Ticket data
   */
  async createTicket(ticketData: Omit<Ticket, 'id'>): Promise<Ticket> {
    return backendService.createData<Ticket>(ENDPOINT, ticketData);
  },

  /**
   * Update an existing ticket
   * @param id Ticket ID
   * @param ticketData Updated ticket data
   */
  async updateTicket(id: string, ticketData: Partial<Ticket>): Promise<Ticket> {
    return backendService.updateData<Ticket>(ENDPOINT, id, ticketData);
  },

  /**
   * Delete a ticket
   * @param id Ticket ID
   */
  async deleteTicket(id: string): Promise<void> {
    return backendService.deleteData(ENDPOINT, id);
  },

  /**
   * Assign a ticket to a teammate
   * @param ticketId Ticket ID
   * @param teammateId Teammate ID
   */
  async assignTicket(ticketId: string, teammateId: string): Promise<Ticket> {
    return backendService.updateData<Ticket>(`${ENDPOINT}/${ticketId}/assign`, ticketId, { teammateId });
  },

  /**
   * Change ticket status
   * @param ticketId Ticket ID
   * @param status New status
   */
  async changeTicketStatus(ticketId: string, status: string): Promise<Ticket> {
    return backendService.updateData<Ticket>(`${ENDPOINT}/${ticketId}/status`, ticketId, { status });
  }
};
