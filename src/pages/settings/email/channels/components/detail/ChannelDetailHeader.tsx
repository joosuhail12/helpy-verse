
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ChannelDetailHeader = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/home/settings/email/channels');
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Email Channel Details</h1>
        <p className="text-muted-foreground">
          View and manage channel settings
        </p>
      </div>
    </div>
  );
};
