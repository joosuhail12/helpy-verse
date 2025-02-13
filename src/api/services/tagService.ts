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
    console.log('Using mock data for tags');
    return filterAndSortMockTags(mockTags, params);
  },

  async createTag(tag: Partial<Tag>): Promise<Tag> {
    console.log('Create tag operation using mock data');
    const newTag: Tag = {
      id: Date.now().toString(),
      name: tag.name || '',
      color: tag.color || '#000000',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      trend: 'stable',
      counts: { tickets: 0, contacts: 0, companies: 0 },
      history: [],
      preview: []
    };
    return newTag;
  },

  async updateTag(id: string, tag: Partial<Tag>): Promise<Tag> {
    console.log('Update tag operation using mock data');
    const updatedTag: Tag = {
      id,
      name: tag.name || '',
      color: tag.color || '#000000',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      trend: 'stable',
      counts: { tickets: 0, contacts: 0, companies: 0 },
      history: [],
      preview: []
    };
    return updatedTag;
  },

  async deleteTags(ids: string[]): Promise<void> {
    console.log('Delete tags operation using mock data', ids);
    return Promise.resolve();
  }
};
