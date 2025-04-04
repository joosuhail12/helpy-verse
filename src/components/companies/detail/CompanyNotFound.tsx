
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export interface CompanyNotFoundProps {
  companyId: string;
}

export const CompanyNotFound: React.FC<CompanyNotFoundProps> = ({ companyId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Company Not Found</h2>
        <p className="text-gray-600 mb-6">
          The company with ID {companyId} could not be found. It may have been deleted or you might not have permission to view it.
        </p>
        <Button onClick={() => navigate('/contacts/companies')}>
          Return to Companies
        </Button>
      </div>
    </div>
  );
};
