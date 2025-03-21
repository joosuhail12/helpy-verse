
import { useState } from 'react';
import type { Teammate } from '@/types/teammate';

/**
 * Hook for sorting teammates
 */
export const useTeammateSorting = (filteredTeammates: Teammate[]) => {
  const [sortBy, setSortBy] = useState<keyof Teammate | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof Teammate) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedTeammates = [...filteredTeammates].sort((a, b) => {
    if (!sortBy) return 0;
    
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  return {
    sortBy,
    sortDirection,
    sortedTeammates,
    handleSort
  };
};
