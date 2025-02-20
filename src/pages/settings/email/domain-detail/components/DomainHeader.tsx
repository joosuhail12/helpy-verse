
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DomainDetails } from '@/api/services/emailService';

interface DomainHeaderProps {
  domain: DomainDetails;
}

export const DomainHeader = ({ domain }: DomainHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        onClick={() => navigate('/home/settings/email/domains')}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Domains
      </Button>
    </div>
  );
};
