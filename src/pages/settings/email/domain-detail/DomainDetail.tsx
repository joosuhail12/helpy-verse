
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DomainDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/home/settings/email/domains')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Domain Details</h1>
          <p className="text-muted-foreground">
            View and manage domain settings
          </p>
        </div>
      </div>
      
      {/* Domain detail content will be implemented here */}
      <div className="bg-gray-100 p-8 rounded-md text-center">
        <p className="text-gray-500">Domain details and configuration will appear here.</p>
      </div>
    </div>
  );
};

export default DomainDetail;
