
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockDomains } from '@/mock/domains';
import { format } from 'date-fns';
import { DomainBadge } from './Domains';

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
              <DomainBadge status={domain.status} />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DNS Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>TTL</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domain.dnsRecords?.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge variant="secondary">{record.type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {record.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {record.value}
                    </TableCell>
                    <TableCell>{record.ttl}</TableCell>
                    <TableCell>{record.priority || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DomainDetail;

