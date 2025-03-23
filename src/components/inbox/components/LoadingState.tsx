
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingState = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="border rounded-lg p-4 bg-white">
          <div className="flex items-start justify-between">
            <div className="space-y-2 w-full">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 mt-3">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
