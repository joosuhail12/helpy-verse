
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompanyNotFoundProps {
  onGoBack: () => void;
}

export const CompanyNotFound = ({ onGoBack }: CompanyNotFoundProps) => {
  return (
    <div className="p-6">
      <Card className="p-6 flex flex-col items-center justify-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-yellow-500" />
        <h2 className="text-xl font-semibold text-gray-800">Company Not Found</h2>
        <p className="text-muted-foreground text-center">
          The company you're looking for doesn't exist or has been deleted.
        </p>
        <Button variant="default" onClick={onGoBack} className="mt-4">
          Return to Companies
        </Button>
      </Card>
    </div>
  );
};
