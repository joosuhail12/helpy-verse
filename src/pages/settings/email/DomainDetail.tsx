
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Copy, Check } from 'lucide-react';
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
import { Steps } from '@/components/ui/steps';
import { toast } from '@/components/ui/use-toast';
import { mockDomains } from '@/mock/domains';
import { format } from 'date-fns';
import { DomainBadge } from './Domains';

const DomainDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const domain = mockDomains.find(d => d.id === id);

  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: "The value has been copied to your clipboard.",
    });
  };

  const verificationSteps = [
    {
      title: 'Add DNS Records',
      description: 'Add the required DNS records to your domain',
      status: domain?.status === 'pending' ? 'current' : 'complete',
    },
    {
      title: 'Verify Domain',
      description: 'Confirm DNS records are properly configured',
      status: domain?.status === 'verified' ? 'complete' : 'pending',
    },
    {
      title: 'Domain Ready',
      description: 'Your domain is ready to use',
      status: domain?.status === 'verified' ? 'complete' : 'pending',
    },
  ];

  const handleVerifyDomain = () => {
    // This would typically make an API call to verify the domain
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
            <Steps steps={verificationSteps} />
          </CardContent>
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
                  <TableHead />
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleCopyToClipboard(record.name)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {record.value}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleCopyToClipboard(record.value)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
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

