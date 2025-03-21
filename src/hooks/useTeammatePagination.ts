
import { useState } from 'react';
import type { Teammate } from '@/types/teammate';

/**
 * Hook for paginating teammate data
 */
export const useTeammatePagination = (sortedTeammates: Teammate[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sortedTeammates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeammates = sortedTeammates.slice(startIndex, startIndex + itemsPerPage);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedTeammates
  };
};
