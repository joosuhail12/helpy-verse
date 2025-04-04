
import { useEffect, useState } from 'react';
import type { Tag, SortField, FilterEntity } from '@/types/tag';
import { tagService } from '@/api/tagsApi';

export const useTags = (
  searchQuery: string = "",
  filterEntity: FilterEntity = "all",
  sortField: SortField = "name",
  sortDirection: 'asc' | 'desc' = 'asc'
) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        // Call your tag service API here
        const response = await tagService.fetchTags({
          searchQuery,
          filterEntity,
          sortField,
          sortDirection
        });
        setTags(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, [searchQuery, filterEntity, sortField, sortDirection]);

  return {
    data: tags,
    isLoading,
    error,
    setTags
  };
};
