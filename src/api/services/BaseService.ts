
import { apiClient, ApiResponse, RequestOptions } from '../client';

/**
 * Base service class with common CRUD operations
 * @template T The entity type this service manages
 * @template R The response type for getAll (defaults to T[])
 */
export abstract class BaseService<T, R = T[]> {
  /**
   * Base API endpoint for this service
   */
  protected abstract endpoint: string;

  /**
   * Get all entities
   */
  async getAll(params?: Record<string, any>): Promise<R> {
    const options: RequestOptions = { params };
    const response = await apiClient.get<R>(this.endpoint, options);
    return response.data;
  }

  /**
   * Get entity by ID
   */
  async getById(id: string): Promise<T> {
    const response = await apiClient.get<T>(`${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * Create new entity
   */
  async create(data: Partial<T>): Promise<T> {
    const response = await apiClient.post<T>(this.endpoint, data);
    return response.data;
  }

  /**
   * Update entity
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    const response = await apiClient.put<T>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  /**
   * Delete entity
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Custom method for making any API request
   */
  protected async request<RespType = any>(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<RespType>> {
    if (method === 'get') {
      return apiClient.get<RespType>(url, options);
    } else if (method === 'post') {
      return apiClient.post<RespType>(url, data, options);
    } else if (method === 'put') {
      return apiClient.put<RespType>(url, data, options);
    } else if (method === 'delete') {
      return apiClient.delete<RespType>(url, options);
    } else if (method === 'patch') {
      return apiClient.patch<RespType>(url, data, options);
    }
    throw new Error(`Unsupported HTTP method: ${method}`);
  }
}
