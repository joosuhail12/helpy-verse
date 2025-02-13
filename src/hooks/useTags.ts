
import { useState } from 'react';
import type { Tag, SortField, FilterEntity } from '@/types/tag';

const mockTags: Tag[] = [
  { 
    id: '1', 
    name: 'Bug', 
    color: '#EF4444', 
    counts: { tickets: 23, contacts: 5, companies: 2 } 
  },
  { 
    id: '2', 
    name: 'Feature Request', 
    color: '#3B82F6', 
    counts: { tickets: 15, contacts: 3, companies: 1 } 
  },
  { 
    id: '3', 
    name: 'Support', 
    color: '#10B981', 
    counts: { tickets: 45, contacts: 12, companies: 8 } 
  },
  { 
    id: '4', 
    name: 'Documentation', 
    color: '#F59E0B', 
    counts: { tickets: 8, contacts: 0, companies: 1 } 
  },
  { 
    id: '5', 
    name: 'Design', 
    color: '#8B5CF6', 
    counts: { tickets: 12, contacts: 4, companies: 2 } 
  }
];

export const useTags = (searchQuery: string, filterEntity: FilterEntity, sortField: SortField, sortDirection: 'asc' | 'desc') => {
  const [tags, setTags] = useState<Tag[]>(mockTags);

  let filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filterEntity !== 'all') {
    filteredTags = filteredTags.filter(tag => tag.counts[filterEntity] > 0);
  }

  filteredTags.sort((a, b) => {
    let valueA = sortField === 'name' ? a.name : a.counts[sortField];
    let valueB = sortField === 'name' ? b.name : b.counts[sortField];
    
    if (sortDirection === 'desc') {
      [valueA, valueB] = [valueB, valueA];
    }
    
    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
  });

  return {
    tags: filteredTags,
    setTags,
  };
};
