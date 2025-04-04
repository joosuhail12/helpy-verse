
import * as React from 'react';
import type { Teammate } from '@/types/teammate';

/**
 * Hook for managing teammates table data including sorting, pagination, and filtering
 */
export const useTeammatesTableData = (teammates: Teammate[]) => {
  const [selectedTeammates, setSelectedTeammates] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<keyof Teammate | null>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // Handle sorting
  const handleSort = (column: keyof Teammate) => {
    if (sortBy === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortBy(column);
      setSortDirection('asc');
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Calculate sorted and paginated teammates
  const sortedTeammates = React.useMemo(() => {
    if (!sortBy) return [...teammates];

    return [...teammates].sort((a, b) => {
      // Handle null values
      if (a[sortBy] === null) return sortDirection === 'asc' ? -1 : 1;
      if (b[sortBy] === null) return sortDirection === 'asc' ? 1 : -1;
      
      // Basic string comparison for most fields
      const valueA = String(a[sortBy] || '');
      const valueB = String(b[sortBy] || '');
      
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  }, [teammates, sortBy, sortDirection]);

  // Apply pagination
  const filteredTeammates = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedTeammates.slice(startIndex, startIndex + pageSize);
  }, [sortedTeammates, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(sortedTeammates.length / pageSize));

  // Handle page change
  const handlePageChange = (page: number) => {
    // Ensure we stay within valid page range
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all visible teammates on current page
      setSelectedTeammates(filteredTeammates.map(teammate => teammate.id));
    } else {
      // Deselect all
      setSelectedTeammates([]);
    }
  };

  // Handle individual teammate selection
  const handleSelectTeammate = (teammateId: string, checked: boolean) => {
    if (checked) {
      setSelectedTeammates(prev => [...prev, teammateId]);
    } else {
      setSelectedTeammates(prev => prev.filter(id => id !== teammateId));
    }
  };

  return {
    filteredTeammates,
    selectedTeammates,
    sortBy,
    sortDirection,
    currentPage,
    pageSize,
    totalPages,
    handleSort,
    handleSelectAll,
    handleSelectTeammate,
    handlePageChange,
  };
};
