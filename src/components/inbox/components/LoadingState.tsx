
import { Skeleton } from "@/components/ui/skeleton";

const LoadingState = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      {[1, 2, 3].map((n) => (
        <div key={n} className="bg-white rounded-xl border border-gray-100/50 p-4 group relative animate-pulse">
          <div className="flex items-start gap-4">
            <Skeleton className="w-4 h-4 rounded-sm" />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
