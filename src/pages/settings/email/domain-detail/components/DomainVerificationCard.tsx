
import { Check } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { DomainBadge } from './DomainBadge';
import { DomainVerificationSteps } from './DomainVerificationSteps';
import { DomainDetails } from '@/api/services/emailService';
import { emailService } from '@/api/services/emailService';

interface DomainVerificationCardProps {
  domain: DomainDetails;
}

export const DomainVerificationCard = ({ domain }: DomainVerificationCardProps) => {
  toast({
    title: "Verification in progress",
    description: "We're verifying your domain configuration...",
  });
  const handleVerifyDomain = async () => {
    await emailService.verifyDomain(domain.id).then((response) => {
      if (response?.data?.isVerified) {
        toast({
          title: "Domain Verified",
          description: "Your domain has been successfully verified.",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: "Failed to verify domain.",
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{domain.domain}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Added on {format(new Date(domain.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DomainBadge status={domain.isVerified ? "verified" : "pending"} />
            {!domain.isVerified && (
              <Button onClick={handleVerifyDomain}>
                <Check className="h-4 w-4 mr-2" />
                Verify Now
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      {/* <CardContent>
        <DomainVerificationSteps domain={domain} />
      </CardContent> */}
    </Card>
  );
};
