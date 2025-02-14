
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Copy, Check, ShieldCheck, ShieldAlert, 
  Calendar, Clock, Mail, MailOff, Database, Server, Globe, Link 
} from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const DNS_RECORD_ICONS = {
  'TXT': Database,
  'MX': Server,
  'CNAME': Link,
} as const;

const DNS_RECORD_COLORS = {
  'TXT': 'bg-purple-100 text-purple-800 border-purple-200',
  'MX': 'bg-blue-100 text-blue-800 border-blue-200',
  'CNAME': 'bg-emerald-100 text-emerald-800 border-emerald-200',
} as const;

const DNS_RECORD_DESCRIPTIONS = {
  'TXT': 'Text record used for domain verification and SPF records',
  'MX': 'Mail exchange record that specifies mail servers for the domain',
  'CNAME': 'Canonical name record that points to another domain name',
} as const;

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
  ] as const;

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
            <Steps steps={verificationSteps} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Domain Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {domain.status === 'verified' ? (
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                  ) : (
                    <ShieldAlert className="h-5 w-5 text-yellow-500" />
                  )}
                  <h3 className="font-medium">SSL Certificate</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {domain.status === 'verified' ? 'Valid and secure' : 'Pending verification'}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Domain Expiry</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(domain.dateAdded), 'MMM d, yyyy')}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Last Verified</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {domain.status === 'verified' 
                    ? format(new Date(domain.dateAdded), 'MMM d, yyyy')
                    : 'Not verified yet'}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {domain.status === 'verified' ? (
                    <Mail className="h-5 w-5 text-green-500" />
                  ) : (
                    <MailOff className="h-5 w-5 text-red-500" />
                  )}
                  <h3 className="font-medium">Email Sending</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {domain.status === 'verified' ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
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
                {domain.dnsRecords?.map((record, index) => {
                  const RecordIcon = DNS_RECORD_ICONS[record.type];
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge 
                                variant="outline"
                                className={`flex items-center gap-1 ${DNS_RECORD_COLORS[record.type]}`}
                              >
                                <RecordIcon className="h-3 w-3" />
                                {record.type}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{DNS_RECORD_DESCRIPTIONS[record.type]}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DomainDetail;

