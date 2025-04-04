import type { Tag, SortField, FilterEntity } from '@/types/tag';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data (keeping the same data as before)
export const mockTags: Tag[] = [
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
    data: {} // Adding the required data property
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
    data: {} // Adding the required data property
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
    data: {} // Adding the required data property
  },
  { 
    id: '4', 
    name: 'Documentation', 
    color: '#F59E0B',
    createdAt: '2024-01-20T11:00:00Z',
    lastUsed: '2024-03-12T09:00:00Z',
    trend: 'stable',
    counts: { tickets: 8, contacts: 0, companies: 1 },
    history: [
      { date: '2024-01-20', total: 10 },
      { date: '2024-02-20', total: 8 },
      { date: '2024-03-20', total: 8 }
    ],
    preview: [],
    data: {} // Adding the required data property
  },
  { 
    id: '5', 
    name: 'Design', 
    color: '#8B5CF6',
    createdAt: '2024-02-01T15:00:00Z',
    lastUsed: '2024-03-13T10:00:00Z',
    trend: 'increasing',
    counts: { tickets: 12, contacts: 4, companies: 2 },
    history: [
      { date: '2024-02-01', total: 5 },
      { date: '2024-02-15', total: 10 },
      { date: '2024-03-01', total: 15 }
    ],
    preview: [
      { type: 'ticket', id: '5', title: 'UI improvement suggestions' }
    ],
    data: {} // Adding the required data property
  }
];

export type TagParams = {
  searchQuery?: string;
  filterEntity?: FilterEntity;
  sortField?: SortField;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

export type TagsResponse = {
  data: Tag[];
  total: number;
};

// Export tagService object with the required methods
export const tagService = {
  async fetchTags(params: TagParams = {}): Promise<TagsResponse> {
    // Simulate API delay
    await delay(500);
    
    const { 
      searchQuery = '', 
      filterEntity = 'all', 
      sortField = 'name', 
      sortDirection = 'asc',
      page = 1,
      limit = 10
    } = params;

    let filteredTags = mockTags.filter(tag =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterEntity !== 'all') {
      filteredTags = filteredTags.filter(tag => tag.counts[filterEntity] > 0);
    }

    filteredTags.sort((a, b) => {
      let valueA: any = sortField === 'name' ? a.name : 
                        sortField === 'lastUsed' ? new Date(a.lastUsed).getTime() :
                        sortField === 'createdAt' ? new Date(a.createdAt).getTime() :
                        a.counts[sortField];
      let valueB: any = sortField === 'name' ? b.name :
                        sortField === 'lastUsed' ? new Date(b.lastUsed).getTime() :
                        sortField === 'createdAt' ? new Date(b.createdAt).getTime() :
                        b.counts[sortField];
      
      if (sortDirection === 'desc') {
        [valueA, valueB] = [valueB, valueA];
      }
      
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    });

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTags = filteredTags.slice(start, end);

    return {
      data: paginatedTags,
      total: filteredTags.length
    };
  },

  async createTag(tag: Partial<Tag>): Promise<Tag> {
    // Simulate API delay
    await delay(500);
    
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
  },

  async updateTag(id: string, tag: Partial<Tag>): Promise<Tag> {
    // Simulate API delay
    await delay(500);
    
    const existingTag = mockTags.find(t => t.id === id);
    
    if (!existingTag) {
      throw new Error('Tag not found');
    }
    
    const updatedTag: Tag = {
      ...existingTag,
      ...tag,
      // Don't add updatedAt as it's not in the Tag interface
      data: existingTag.data
    };
    
    return updatedTag;
  },

  async deleteTags(ids: string[]): Promise<void> {
    // Simulate API delay
    await delay(500);
    return;
  }
};

// Keep the original export for backward compatibility 
export const fetchTags = async (
  searchQuery: string,
  filterEntity: FilterEntity,
  sortField: SortField,
  sortDirection: 'asc' | 'desc',
  page: number = 1,
  limit: number = 10
): Promise<{ tags: Tag[], total: number }> => {
  // Use the newly defined service
  const response = await tagService.fetchTags({
    searchQuery,
    filterEntity,
    sortField,
    sortDirection,
    page,
    limit
  });
  
  return {
    tags: response.data,
    total: response.total
  };
};
