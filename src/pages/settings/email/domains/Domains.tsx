
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { mockDomains, type Domain } from '@/mock/domains';
import { AddDomainDialog } from './components/AddDomainDialog';
import { DomainListItem } from './components/DomainListItem';

const Domains = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState<Domain[]>(mockDomains);

  const handleAddDomain = (domain: Domain) => {
    setDomains([domain, ...domains]);
    toast({
      title: 'Domain added',
      description: 'The domain has been added and is pending verification.',
    });
    navigate(`/home/settings/email/domains/${domain.id}`);
  };

  const handleVerify = (domainId: string) => {
    setDomains(domains.map(d => 
      d.id === domainId 
        ? { ...d, status: 'verified' as const }
        : d
    ));

    toast({
      title: 'Domain verified',
      description: 'The domain has been successfully verified.',
    });
  };

  const handleDelete = (domainId: string) => {
    setDomains(domains.filter(d => d.id !== domainId));
    toast({
      title: 'Domain removed',
      description: 'The domain has been removed successfully.',
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
        <AddDomainDialog onAddDomain={handleAddDomain} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Domains</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[500px]">
          <CardContent>
            <div className="space-y-4">
              {domains.map((domain) => (
                <DomainListItem
                  key={domain.id}
                  domain={domain}
                  onVerify={handleVerify}
                  onDelete={handleDelete}
                  onNavigate={(id) => navigate(`/home/settings/email/domains/${id}`)}
                />
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default Domains;
