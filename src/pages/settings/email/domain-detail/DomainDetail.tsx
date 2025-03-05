import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DomainHeader } from './components/DomainHeader';
import { DomainVerificationCard } from './components/DomainVerificationCard';
import { DomainHealthCard } from './components/DomainHealthCard';
import { DomainDNSCard } from './components/DomainDNSCard';
import { useEffect, useState } from 'react';
import { emailService } from '@/api/services/emailService';
import { DomainDetails } from '@/api/services/emailService';

const DomainDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [domain, setDomain] = useState<DomainDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDomain = async () => {
      // Fetch domain by id
      await emailService.getSingleDomainDetails(id).then((response) => {
        setDomain(response.data);
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        setLoading(false);
      });
    };

    getDomain();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
