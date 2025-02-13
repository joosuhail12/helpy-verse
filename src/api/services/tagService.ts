
import type { Tag, SortField, FilterEntity } from '@/types/tag';

const API_URL = '/api/tags'; // Update this to match your Node.js backend URL

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
    const queryParams = new URLSearchParams();
    if (params.searchQuery) queryParams.set('search', params.searchQuery);
    if (params.filterEntity) queryParams.set('entity', params.filterEntity);
    if (params.sortField) queryParams.set('sort', params.sortField);
    if (params.sortDirection) queryParams.set('direction', params.sortDirection);
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());

    const response = await fetch(`${API_URL}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }
    return response.json();
  },

  async createTag(tag: Partial<Tag>): Promise<Tag> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tag),
    });
    if (!response.ok) {
      throw new Error('Failed to create tag');
    }
    return response.json();
  },

  async updateTag(id: string, tag: Partial<Tag>): Promise<Tag> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tag),
    });
    if (!response.ok) {
      throw new Error('Failed to update tag');
    }
    return response.json();
  },

  async deleteTags(ids: string[]): Promise<void> {
    const response = await fetch(`${API_URL}/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) {
      throw new Error('Failed to delete tags');
    }
  }
};
