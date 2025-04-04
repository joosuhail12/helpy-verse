
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompanyDetailErrorProps {
  onRetry: () => void;
  onGoBack: () => void;
}

export const CompanyDetailError = ({ onRetry, onGoBack }: CompanyDetailErrorProps) => {
  return (
    <div className="p-6">
      <Card className="p-6 flex flex-col items-center justify-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold text-gray-800">Unable to load company</h2>
        <p className="text-muted-foreground text-center max-w-md">
          There was a problem loading this company's details. This may be due to a network issue or the company may not exist.
        </p>
        <div className="flex gap-3 mt-4">
          <Button onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
          <Button variant="outline" onClick={onGoBack}>
            Return to Companies
          </Button>
        </div>
      </Card>
    </div>
  );
};
