
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DomainHealthStatus } from './DomainHealthStatus';
import type { Domain } from '@/mock/domains';

interface DomainHealthCardProps {
  domain: Domain;
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
