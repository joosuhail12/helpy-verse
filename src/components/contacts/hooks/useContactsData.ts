
import { useState, useCallback } from 'react';
import { useGetContactsQuery } from '@/api/services/contactsApi';
import { useLoadingState } from '@/hooks/useLoadingState';
import type { ContactFilters } from '@/types/contact';

export const useContactsData = (initialFilters: ContactFilters = { search: '', status: [], type: [], tags: [] }) => {
  const [filters, setFilters] = useState<ContactFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Query contacts with current filters and pagination
  const contactsQuery = useGetContactsQuery({
    ...filters,
    page,
    limit
  });
  
  // Use our loading state hook to standardize loading states
  const { 
    data, 
    isInitialLoading, 
    isRefreshing, 
    isAnyLoading, 
    isError, 
    errorMessage, 
    isEmpty, 
    retry 
  } = useLoadingState(contactsQuery);
  
  // Handler for updating filters
  const updateFilters = useCallback((newFilters: Partial<ContactFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset to first page when filters change
    setPage(1);
  }, []);
  
  // Handler for pagination
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);
  
  // Handler for changing results per page
  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  }, []);
  
  return {
    // Data
    contacts: data?.data || [],
    total: data?.total || 0,
    
    // Pagination
    page,
    limit,
    handlePageChange,
    handleLimitChange,
    
    // Filters
    filters,
    updateFilters,
    
    // Loading states
    isLoading: isInitialLoading,
    isRefreshing,
    isAnyLoading,
    isError,
    errorMessage,
    isEmpty,
    retry
  };
};
