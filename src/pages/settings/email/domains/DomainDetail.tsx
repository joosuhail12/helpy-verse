import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockDomains } from '@/mock/domains';
import { DomainHeader } from './components/DomainHeader';
import { DomainVerificationCard } from './components/DomainVerificationCard';
import { DomainHealthCard } from './components/DomainHealthCard';
import { DomainDNSCard } from './components/DomainDNSCard';

const DomainDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const domain = mockDomains.find(d => d.id === id);

  if (!domain) {
    return (
      <div className="container max-w-5xl py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Domain not found</h1>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/home/settings/email/domains')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Domains
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-6">
      <DomainHeader domain={domain} />
      <div className="space-y-6">
        <DomainVerificationCard domain={domain} />
        <DomainHealthCard domain={domain} />
        <DomainDNSCard domain={domain} />
      </div>
    </div>
  );
};

export default DomainDetail;
