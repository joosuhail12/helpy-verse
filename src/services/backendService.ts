
import api from './api';

/**
 * Generic service for interacting with the Node.js backend
 */
export const backendService = {
  /**
   * Fetch data from the backend
   * @param endpoint The API endpoint
   * @param queryParams Optional query parameters
   */
  async fetchData<T>(endpoint: string, queryParams?: Record<string, string>): Promise<T> {
    try {
      const queryString = queryParams 
        ? `?${new URLSearchParams(queryParams).toString()}` 
        : '';
      
      const response = await api.get(`${endpoint}${queryString}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Create a new record in the backend
   * @param endpoint The API endpoint
   * @param data The data to create
   */
  async createData<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error creating data at ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Update an existing record in the backend
   * @param endpoint The API endpoint
   * @param id The ID of the record to update
   * @param data The data to update
   */
  async updateData<T>(endpoint: string, id: string, data: any): Promise<T> {
    try {
      const response = await api.put(`${endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating data at ${endpoint}/${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a record from the backend
   * @param endpoint The API endpoint
   * @param id The ID of the record to delete
   */
  async deleteData(endpoint: string, id: string): Promise<void> {
    try {
      await api.delete(`${endpoint}/${id}`);
    } catch (error) {
      console.error(`Error deleting data at ${endpoint}/${id}:`, error);
      throw error;
    }
  }
};
