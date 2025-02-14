
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DomainDNSRecords } from './DomainDNSRecords';
import type { Domain } from '@/mock/domains';

interface DomainDNSCardProps {
  domain: Domain;
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
