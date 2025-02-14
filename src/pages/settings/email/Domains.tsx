
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Globe, ShieldCheck, ShieldAlert, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { mockDomains, Domain } from '@/mock/domains';
import { format } from 'date-fns';

export const DomainBadge = ({ status }: { status: Domain['status'] }) => {
  const variants = {
    verified: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
  };

  const icons = {
    verified: ShieldCheck,
    pending: Globe,
    failed: ShieldAlert,
  };

  const Icon = icons[status];

  return (
    <Badge variant="outline" className={`${variants[status]} gap-1`}>
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const Domains = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [domainName, setDomainName] = useState('');
  const [domainValue, setDomainValue] = useState('');
  const [ownerConfirmed, setOwnerConfirmed] = useState(false);
  const [isAddingDomain, setIsAddingDomain] = useState(false);

  const handleAddDomain = () => {
    if (!domainName || !domainValue || !ownerConfirmed) return;

    const domain: Domain = {
      id: Date.now().toString(),
      domain: domainValue,
      status: 'pending',
      dateAdded: new Date().toISOString(),
      verificationRecord: `lovable-verify=${Math.random().toString(36).substring(7)}`,
      ownerConfirmed: true,
      dnsRecords: [
        {
          type: 'TXT',
          name: `_lovable-verification.${domainValue}`,
          value: `lovable-verify=${Math.random().toString(36).substring(7)}`,
          ttl: 3600
        },
        {
          type: 'MX',
          name: domainValue,
          value: 'mx.lovable.mail',
          ttl: 3600,
          priority: 10
        },
        {
          type: 'CNAME',
          name: `mail.${domainValue}`,
          value: 'mail.lovable.com',
          ttl: 3600
        }
      ]
    };

    setDomains([domain, ...domains]);
    setDomainName('');
    setDomainValue('');
    setOwnerConfirmed(false);
    setIsAddingDomain(false);
    
    toast({
      title: 'Domain added',
      description: 'The domain has been added and is pending verification.',
    });

    // Navigate to the domain detail page
    navigate(`/home/settings/email/domains/${domain.id}`);
  };

  const handleVerify = (domainId: string) => {
    setDomains(domains.map(d => 
      d.id === domainId 
        ? { ...d, status: 'verified' }
        : d
    ));

    toast({
      title: 'Domain verified',
      description: 'The domain has been successfully verified.',
    });
  };

  return (
    <div className="container max-w-5xl py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Domain Management</h1>
          <p className="text-muted-foreground mt-1">
            Connect and verify your domains to send emails
          </p>
        </div>
        <Dialog open={isAddingDomain} onOpenChange={setIsAddingDomain}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new domain</DialogTitle>
              <DialogDescription>
                Enter your domain details to start the verification process.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domainName">Domain Name</Label>
                <Input
                  id="domainName"
                  placeholder="My Company Domain"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={domainValue}
                  onChange={(e) => setDomainValue(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ownership"
                  checked={ownerConfirmed}
                  onCheckedChange={(checked) => setOwnerConfirmed(!!checked)}
                />
                <Label
                  htmlFor="ownership"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I confirm that I own this domain
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingDomain(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddDomain}
                disabled={!domainName || !domainValue || !ownerConfirmed}
              >
                Add Domain
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Domains</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[500px]">
          <CardContent>
            <div className="space-y-4">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <button
                        className="font-medium hover:underline"
                        onClick={() => navigate(`/home/settings/email/domains/${domain.id}`)}
                      >
                        {domain.domain}
                      </button>
                      <DomainBadge status={domain.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Added on {format(new Date(domain.dateAdded), 'MMM d, yyyy')}
                    </p>
                    {domain.status === 'pending' && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium">Verification Record:</p>
                        <code className="px-2 py-1 bg-secondary rounded text-xs">
                          {domain.verificationRecord}
                        </code>
                      </div>
                    )}
                    {domain.status === 'failed' && domain.error && (
                      <p className="text-sm text-red-500 mt-1">{domain.error}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {domain.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerify(domain.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setDomains(domains.filter(d => d.id !== domain.id));
                        toast({
                          title: 'Domain removed',
                          description: 'The domain has been removed successfully.',
                        });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default Domains;

