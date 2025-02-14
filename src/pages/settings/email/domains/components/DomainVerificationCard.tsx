
import { Check } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { DomainBadge } from './DomainBadge';
import { DomainVerificationSteps } from './DomainVerificationSteps';
import type { Domain } from '@/mock/domains';

interface DomainVerificationCardProps {
  domain: Domain;
}

export const DomainVerificationCard = ({ domain }: DomainVerificationCardProps) => {
  const handleVerifyDomain = () => {
    toast({
      title: "Verification in progress",
      description: "We're verifying your domain configuration...",
    });
  };

  return (
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
  );
};
