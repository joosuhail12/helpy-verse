import { useState } from 'react';
import type { Tag, SortField, FilterEntity } from '@/types/tag';

export const useTags = (searchQuery: string, filterEntity: FilterEntity, sortField: SortField, sortDirection: 'asc' | 'desc') => {
  const [tags, setTags] = useState<Tag[]>();

  let filteredTags = tags.filter(tag =>
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

  return {
    tags: filteredTags,
    setTags,
  };
};
