
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export interface CompanyDetailErrorProps {
  error: string;
}

export const CompanyDetailError = ({ error }: CompanyDetailErrorProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Failed to load company details"}
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 flex justify-center">
          <Button onClick={() => navigate('/contacts/companies')}>
            Return to Companies
          </Button>
        </div>
      </div>
    </div>
  );
};
