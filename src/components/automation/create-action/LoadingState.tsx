
import { Skeleton } from '@/components/ui/skeleton';

export const LoadingState = () => {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
};

