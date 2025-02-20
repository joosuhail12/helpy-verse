import type { Tag, SortField, FilterEntity } from '@/types/tag';
import { HttpClient } from '@/api/services/HttpClient';

const API_URL = '/tag';

export interface TagsResponse {
  tags: Tag[];
  total: number;
}

export interface TagParams {
  searchQuery?: string;
  filterEntity?: FilterEntity;
  sortField?: SortField;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const tagService = {
  async fetchTags(params: TagParams): Promise<TagsResponse> {
    try {
      const response = await HttpClient.apiClient.get<TagsResponse>(API_URL, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw new Error('Failed to fetch tags');
    }
  },

  // ✅ Create a new tag
  async createTag(tag: Partial<Tag>): Promise<Tag> {
    try {
      const response = await HttpClient.apiClient.post<Tag>(API_URL, tag);
      return response.data;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw new Error('Failed to create tag');
    }
  },

  // ✅ Update an existing tag
  async updateTag(id: string, tag: Partial<Tag>): Promise<Tag> {
    try {
      const response = await HttpClient.apiClient.put<Tag>(`${API_URL}/${id}`, tag);
      return response.data;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw new Error('Failed to update tag');
    }
  },

  // ✅ Delete tags by ID array
  async deleteTags(ids: string[]): Promise<void> {
    try {
      await HttpClient.apiClient.delete(API_URL, {
        data: { ids },
      });
    } catch (error) {
      console.error('Error deleting tags:', error);
      throw new Error('Failed to delete tags');
    }
  }
};
