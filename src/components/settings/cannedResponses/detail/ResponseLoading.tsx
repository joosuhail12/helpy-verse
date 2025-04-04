
import React from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

/**
 * Loading state for canned response details
 */
export const ResponseLoading = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner className="h-8 w-8" />
    </div>
  );
};
