
import { useState, useEffect } from 'react';

export type QueryResult<T> = {
  data?: T;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error?: any;
  refetch?: () => void;
};

export type LoadingState<T> = {
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isAnyLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  retry?: () => void;
  data?: T;
};

/**
 * A hook that provides standardized loading states and error handling
 * for use with RTK Query or any other data fetching mechanism
 */
export function useLoadingState<T>(queryResult: QueryResult<T>): LoadingState<T> {
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Track if we're refreshing existing data
  useEffect(() => {
    if (!isLoading && isFetching) {
      setIsRefreshing(true);
    } else if (!isFetching) {
      setIsRefreshing(false);
    }
  }, [isLoading, isFetching]);

  // Determine the overall loading state
  return {
    isInitialLoading: isLoading,
    isRefreshing,
    isAnyLoading: isLoading || isFetching,
    isError,
    errorMessage: isError ? error?.message || 'An error occurred' : null,
    isEmpty: !isLoading && !isError && (!data || (Array.isArray(data) && data.length === 0)),
    retry: refetch,
    data,
  };
}
