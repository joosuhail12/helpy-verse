
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { mockDomains } from '@/mock/domains';
import { format } from 'date-fns';
import { DomainBadge } from './Domains';
import { DomainHealthStatus } from './components/DomainHealthStatus';
import { DomainDNSRecords } from './components/DomainDNSRecords';
import { DomainVerificationSteps } from './components/DomainVerificationSteps';

const DomainDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const domain = mockDomains.find(d => d.id === id);

  const handleVerifyDomain = () => {
    toast({
      title: "Verification in progress",
      description: "We're verifying your domain configuration...",
    });
  };

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
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/home/settings/email/domains')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Domains
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{domain.domain}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Added on {format(new Date(domain.dateAdded), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <DomainBadge status={domain.status} />
                {domain.status !== 'verified' && (
                  <Button onClick={handleVerifyDomain}>
                    <Check className="h-4 w-4 mr-2" />
                    Verify Now
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DomainVerificationSteps domain={domain} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Domain Health</CardTitle>
          </CardHeader>
          <CardContent>
            <DomainHealthStatus domain={domain} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DNS Records</CardTitle>
          </CardHeader>
          <CardContent>
            <DomainDNSRecords domain={domain} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DomainDetail;
