
import type { Tag, SortField, FilterEntity } from '@/types/tag';
import { mockTags } from '@/api/tagsApi';

const API_URL = '/api/tags';

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

const filterAndSortMockTags = (mockTags: Tag[], params: TagParams): TagsResponse => {
  let filteredTags = [...mockTags];

  // Apply search filter
  if (params.searchQuery) {
    filteredTags = filteredTags.filter(tag =>
      tag.name.toLowerCase().includes(params.searchQuery!.toLowerCase())
    );
  }

  // Apply entity filter
  if (params.filterEntity && params.filterEntity !== 'all') {
    filteredTags = filteredTags.filter(tag => tag.counts[params.filterEntity!] > 0);
  }

  // Apply sorting
  if (params.sortField) {
    filteredTags.sort((a, b) => {
      let valueA: any = params.sortField === 'name' ? a.name : 
                        params.sortField === 'lastUsed' ? new Date(a.lastUsed).getTime() :
                        params.sortField === 'createdAt' ? new Date(a.createdAt).getTime() :
                        a.counts[params.sortField];
      let valueB: any = params.sortField === 'name' ? b.name :
                        params.sortField === 'lastUsed' ? new Date(b.lastUsed).getTime() :
                        params.sortField === 'createdAt' ? new Date(b.createdAt).getTime() :
                        b.counts[params.sortField];
      
      return params.sortDirection === 'desc' ? valueB - valueA : valueA - valueB;
    });
  }

  // Apply pagination
  const startIndex = ((params.page || 1) - 1) * (params.limit || 10);
  const endIndex = startIndex + (params.limit || 10);
  const paginatedTags = filteredTags.slice(startIndex, endIndex);

  return {
    tags: paginatedTags,
    total: filteredTags.length
  };
};

export const tagService = {
  async fetchTags(params: TagParams): Promise<TagsResponse> {
    try {
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
    } catch (error) {
      console.log('API unavailable, using mock data:', error);
      return filterAndSortMockTags(mockTags, params);
    }
  },

  async createTag(tag: Partial<Tag>): Promise<Tag> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tag),
      });
      if (!response.ok) {
        throw new Error('Failed to create tag');
      }
      return response.json();
    } catch (error) {
      console.log('API unavailable for creating tag, operation not supported in mock mode');
      throw error;
    }
  },

  async updateTag(id: string, tag: Partial<Tag>): Promise<Tag> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tag),
      });
      if (!response.ok) {
        throw new Error('Failed to update tag');
      }
      return response.json();
    } catch (error) {
      console.log('API unavailable for updating tag, operation not supported in mock mode');
      throw error;
    }
  },

  async deleteTags(ids: string[]): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete tags');
      }
    } catch (error) {
      console.log('API unavailable for deleting tags, operation not supported in mock mode');
      throw error;
    }
  }
};

