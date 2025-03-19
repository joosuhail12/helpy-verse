
import type { Tag, SortField, FilterEntity } from '@/types/tag';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
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
      { date: '2024-03-01', count: 20, total: 20 }, // Changed to match TagHistoryItem
      { date: '2024-03-08', count: 25, total: 25 },
      { date: '2024-03-15', count: 30, total: 30 }
    ],
    preview: [
      { id: '1', name: 'Login page error', type: 'ticket', title: 'Login page error' }, // Changed to match TagPreviewItem
      { id: '2', name: 'John Smith', type: 'contact', title: 'John Smith' }
    ],
    data: {}
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
      { date: '2024-02-15', count: 15, total: 15 },
      { date: '2024-03-01', count: 16, total: 16 },
      { date: '2024-03-15', count: 15, total: 15 }
    ],
    preview: [
      { id: '3', name: 'Add dark mode', type: 'ticket', title: 'Add dark mode' }
    ],
    data: {}
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
      { date: '2024-01-10', count: 50, total: 50 },
      { date: '2024-02-10', count: 40, total: 40 },
      { date: '2024-03-10', count: 30, total: 30 }
    ],
    preview: [
      { id: '4', name: 'Password reset issue', type: 'ticket', title: 'Password reset issue' }
    ],
    data: {}
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
      { date: '2024-01-20', count: 10, total: 10 },
      { date: '2024-02-20', count: 8, total: 8 },
      { date: '2024-03-20', count: 8, total: 8 }
    ],
    preview: [],
    data: {}
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
      { date: '2024-02-01', count: 5, total: 5 },
      { date: '2024-02-15', count: 10, total: 10 },
      { date: '2024-03-01', count: 15, total: 15 }
    ],
    preview: [
      { id: '5', name: 'UI improvement suggestions', type: 'ticket', title: 'UI improvement suggestions' }
    ],
    data: {}
  }
];

// Create a tag service to use in tagsSlice.ts
export const tagService = {
  fetchTags: async (params: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: mockTags,
      total: mockTags.length
    };
  },
  createTag: async (tag: Partial<Tag>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTag: Tag = {
      id: `tag-${Math.random().toString(36).substring(2, 9)}`,
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
    return {
      data: [...mockTags, newTag],
      total: mockTags.length + 1
    };
  },
  updateTag: async (id: string, tag: Partial<Tag>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedTags = mockTags.map(t => (t.id === id ? { ...t, ...tag } : t));
    return {
      data: updatedTags,
      total: updatedTags.length
    };
  },
  deleteTags: async (ids: string[]) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

export const fetchTags = async (
  searchQuery: string,
  filterEntity: FilterEntity,
  sortField: SortField,
  sortDirection: 'asc' | 'desc',
  page: number = 1,
  limit: number = 10
): Promise<{ tags: Tag[], total: number }> => {
  // Simulate API delay
  await delay(500);

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
    tags: paginatedTags,
    total: filteredTags.length
  };
};
