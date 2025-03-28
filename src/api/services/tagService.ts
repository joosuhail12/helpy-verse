
import type { Tag, SortField, FilterEntity } from '@/types/tag';
import { HttpClient } from '@/api/services/http';

const API_URL = '/api/tags';

export interface TagsResponse {
  data: Tag[];
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

// Simulated delay for dev purposes
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockTags: Tag[] = [
  { 
    id: '1', 
    name: 'Bug', 
    color: '#EF4444',
    createdAt: '2024-03-01T10:00:00Z',
    lastUsed: '2024-03-15T14:30:00Z',
    trend: 'increasing',
    counts: { tickets: 23, contacts: 5, companies: 2 },
    history: [
      { date: '2024-03-01', total: 20 },
      { date: '2024-03-08', total: 25 },
      { date: '2024-03-15', total: 30 }
    ],
    preview: [
      { type: 'ticket', id: '1', title: 'Login page error' },
      { type: 'contact', id: '2', title: 'John Smith' }
    ],
    data: {} // Required data property
  },
  { 
    id: '2', 
    name: 'Feature Request', 
    color: '#3B82F6',
    createdAt: '2024-02-15T09:00:00Z',
    lastUsed: '2024-03-14T11:20:00Z',
    trend: 'stable',
    counts: { tickets: 15, contacts: 3, companies: 1 },
    history: [
      { date: '2024-02-15', total: 15 },
      { date: '2024-03-01', total: 16 },
      { date: '2024-03-15', total: 15 }
    ],
    preview: [
      { type: 'ticket', id: '3', title: 'Add dark mode' }
    ],
    data: {} // Required data property
  },
  { 
    id: '3', 
    name: 'Support', 
    color: '#10B981',
    createdAt: '2024-01-10T08:00:00Z',
    lastUsed: '2024-03-10T12:00:00Z',
    trend: 'decreasing',
    counts: { tickets: 45, contacts: 12, companies: 8 },
    history: [
      { date: '2024-01-10', total: 50 },
      { date: '2024-02-10', total: 40 },
      { date: '2024-03-10', total: 30 }
    ],
    preview: [
      { type: 'ticket', id: '4', title: 'Password reset issue' }
    ],
    data: {} // Required data property
  }
];

export const tagService = {
  async fetchTags(params: TagParams): Promise<TagsResponse> {
    try {
      // In development, use mock data
      if (process.env.NODE_ENV === 'development') {
        await delay(300);
        
        let filteredTags = [...mockTags];
        
        // Apply search filter
        if (params.searchQuery) {
          filteredTags = filteredTags.filter(tag => 
            tag.name.toLowerCase().includes(params.searchQuery!.toLowerCase())
          );
        }
        
        // Apply entity filter
        if (params.filterEntity && params.filterEntity !== 'all') {
          filteredTags = filteredTags.filter(tag => 
            tag.counts[params.filterEntity as keyof typeof tag.counts] > 0
          );
        }
        
        // Apply sorting
        if (params.sortField) {
          filteredTags.sort((a, b) => {
            let valueA, valueB;
            
            if (params.sortField === 'name') {
              valueA = a.name;
              valueB = b.name;
            } else if (params.sortField === 'lastUsed' || params.sortField === 'createdAt') {
              valueA = new Date(a[params.sortField]).getTime();
              valueB = new Date(b[params.sortField]).getTime();
            } else {
              valueA = a.counts[params.sortField as keyof typeof a.counts];
              valueB = b.counts[params.sortField as keyof typeof b.counts];
            }
            
            if (params.sortDirection === 'desc') {
              return valueB > valueA ? 1 : valueB < valueA ? -1 : 0;
            }
            
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
          });
        }
        
        // Apply pagination
        const page = params.page || 1;
        const limit = params.limit || 10;
        const start = (page - 1) * limit;
        const end = start + limit;
        
        const paginatedTags = filteredTags.slice(start, end);
        
        return {
          data: paginatedTags,
          total: filteredTags.length
        };
      }
      
      // In production, use the actual API
      const response = await HttpClient.apiClient.get<TagsResponse>(API_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw new Error('Failed to fetch tags');
    }
  },

  async createTag(tag: Partial<Tag>): Promise<Tag> {
    try {
      // In development, simulate API call
      if (process.env.NODE_ENV === 'development') {
        await delay(300);
        
        const newTag: Tag = {
          id: `new-${Date.now()}`,
          name: tag.name || 'New Tag',
          color: tag.color || '#000000',
          createdAt: new Date().toISOString(),
          lastUsed: new Date().toISOString(),
          trend: 'stable',
          counts: { tickets: 0, contacts: 0, companies: 0 },
          history: [],
          preview: [],
          data: {}
        };
        
        return newTag;
      }
      
      // In production, use the actual API
      const response = await HttpClient.apiClient.post<Tag>(API_URL, tag);
      return response.data;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw new Error('Failed to create tag');
    }
  },

  async updateTag(id: string, tag: Partial<Tag>): Promise<Tag> {
    try {
      // In development, simulate API call
      if (process.env.NODE_ENV === 'development') {
        await delay(300);
        
        const existingTag = mockTags.find(t => t.id === id);
        
        if (!existingTag) {
          throw new Error('Tag not found');
        }
        
        const updatedTag: Tag = {
          ...existingTag,
          ...tag,
          updatedAt: new Date().toISOString()
        };
        
        return updatedTag;
      }
      
      // In production, use the actual API
      const response = await HttpClient.apiClient.put<Tag>(`${API_URL}/${id}`, tag);
      return response.data;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw new Error('Failed to update tag');
    }
  },

  async deleteTags(ids: string[]): Promise<void> {
    try {
      // In development, simulate API call
      if (process.env.NODE_ENV === 'development') {
        await delay(300);
        return;
      }
      
      // In production, use the actual API
      await HttpClient.apiClient.delete(API_URL, { data: { ids } });
    } catch (error) {
      console.error('Error deleting tags:', error);
      throw new Error('Failed to delete tags');
    }
  }
};
