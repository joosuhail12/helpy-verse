
import { Card } from '@/components/ui/card';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export const CompanyDetailLoading = () => {
  return (
    <div className="p-6">
      <Card className="p-6 flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner className="h-8 w-8" />
        <p className="text-muted-foreground">Loading company details...</p>
      </Card>
    </div>
  );
};
