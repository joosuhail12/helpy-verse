
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export interface CompanyDetailErrorProps {
  message: string;
}

export const CompanyDetailError: React.FC<CompanyDetailErrorProps> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Error Loading Company</h2>
        <p className="text-gray-600 mb-6">
          {message || 'An error occurred while loading the company details. Please try again later.'}
        </p>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
          <Button onClick={() => navigate('/contacts/companies')}>
            Return to Companies
          </Button>
        </div>
      </div>
    </div>
  );
};
