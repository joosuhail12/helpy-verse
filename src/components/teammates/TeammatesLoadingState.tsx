
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const TeammatesLoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      <Card className="p-4">
        {/* Table header skeleton */}
        <div className="flex border-b pb-3 mb-4">
          <Skeleton className="h-5 w-5 mx-4" />
          <Skeleton className="h-5 w-40 mx-4" />
          <Skeleton className="h-5 w-48 mx-4" />
          <Skeleton className="h-5 w-24 mx-4" />
          <Skeleton className="h-5 w-24 mx-4" />
          <Skeleton className="h-5 w-32 mx-4" />
        </div>
        
        {/* Table rows skeletons */}
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="flex items-center py-4 border-b last:border-0">
            <Skeleton className="h-4 w-4 mx-4" />
            <div className="flex items-center gap-3 w-40 mx-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-5 w-48 mx-4" />
            <Skeleton className="h-5 w-24 mx-4" />
            <Skeleton className="h-5 w-24 mx-4" />
            <Skeleton className="h-5 w-32 mx-4" />
            <Skeleton className="h-6 w-6 mx-4" />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default TeammatesLoadingState;
