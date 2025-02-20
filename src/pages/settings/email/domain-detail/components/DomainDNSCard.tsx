
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DomainDNSRecords } from './DomainDNSRecords';
import { DomainDetails } from '@/api/services/emailService';

interface DomainDNSCardProps {
  domain: DomainDetails;
}

export const DomainDNSCard = ({ domain }: DomainDNSCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DNS Records</CardTitle>
      </CardHeader>
      <CardContent>
        <DomainDNSRecords domain={domain} />
      </CardContent>
    </Card>
  );
};
