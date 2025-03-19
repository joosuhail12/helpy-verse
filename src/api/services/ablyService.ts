
import { HttpClient } from './http';

export interface AblyTokenResponse {
  token: string;
}

export const ablyService = {
  /**
   * Get an Ably token for real-time connectivity
   */
  async getToken(): Promise<AblyTokenResponse> {
    try {
      const response = await HttpClient.apiClient.get<AblyTokenResponse>('/ably-token');
      return response.data;
    } catch (error) {
      console.error('Error fetching Ably token:', error);
      throw new Error('Failed to get Ably token');
    }
  }
};
