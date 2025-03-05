
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DomainHealthStatus } from './DomainHealthStatus';
import { DomainDetails } from '@/api/services/emailService';

interface DomainHealthCardProps {
  domain: DomainDetails;
}

export const DomainHealthCard = ({ domain }: DomainHealthCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Domain Health</CardTitle>
      </CardHeader>
      <CardContent>
        <DomainHealthStatus domain={domain} />
      </CardContent>
    </Card>
  );
};
