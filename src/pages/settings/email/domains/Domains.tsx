
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDomains } from '@/mock/domains';
import { Card } from '@/components/ui/card';
import { DomainListItem } from './components/DomainListItem';
import { toast } from '@/components/ui/use-toast';

const Domains = () => {
  const navigate = useNavigate();

  const handleVerify = (id: string) => {
    // TODO: Implement domain verification with backend
    toast({
      title: "Verification initiated",
      description: "Domain verification process has started.",
    });
  };

  const handleDelete = (id: string) => {
    // TODO: Implement domain deletion with backend
    toast({
      title: "Domain deleted",
      description: "The domain has been removed successfully.",
    });
  };

  const handleNavigate = (id: string) => {
    navigate(`/home/settings/email/domains/${id}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="divide-y">
          {mockDomains.map((domain) => (
            <DomainListItem 
              key={domain.id} 
              domain={domain}
              onVerify={handleVerify}
              onDelete={handleDelete}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Domains;
