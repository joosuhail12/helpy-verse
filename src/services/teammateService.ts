
import { backendService } from './backendService';
import type { Teammate } from '@/types/teammate';

const ENDPOINT = '/teammates';

export const teammateService = {
  /**
   * Get all teammates
   */
  async getTeammates(): Promise<Teammate[]> {
    return backendService.fetchData<Teammate[]>(ENDPOINT);
  },

  /**
   * Get a specific teammate by ID
   * @param id Teammate ID
   */
  async getTeammateById(id: string): Promise<Teammate> {
    return backendService.fetchData<Teammate>(`${ENDPOINT}/${id}`);
  },

  /**
   * Create a new teammate
   * @param teammateData Teammate data
   */
  async createTeammate(teammateData: Omit<Teammate, 'id'>): Promise<Teammate> {
    return backendService.createData<Teammate>(ENDPOINT, teammateData);
  },

  /**
   * Update an existing teammate
   * @param id Teammate ID
   * @param teammateData Updated teammate data
   */
  async updateTeammate(id: string, teammateData: Partial<Teammate>): Promise<Teammate> {
    return backendService.updateData<Teammate>(ENDPOINT, id, teammateData);
  },

  /**
   * Delete a teammate
   * @param id Teammate ID
   */
  async deleteTeammate(id: string): Promise<void> {
    return backendService.deleteData(ENDPOINT, id);
  }
};
