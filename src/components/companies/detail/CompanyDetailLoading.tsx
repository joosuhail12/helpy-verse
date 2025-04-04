
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const CompanyDetailLoading = () => {
  return (
    <div className="p-6">
      <Card className="p-6 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading company details...</p>
      </Card>
    </div>
  );
};
