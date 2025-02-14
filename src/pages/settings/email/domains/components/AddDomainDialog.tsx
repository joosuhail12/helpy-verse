
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import type { Domain } from '@/mock/domains';

interface AddDomainDialogProps {
  onAddDomain: (domain: Domain) => void;
}

export const AddDomainDialog = ({ onAddDomain }: AddDomainDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [domainValue, setDomainValue] = useState('');
  const [ownerConfirmed, setOwnerConfirmed] = useState(false);

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

    onAddDomain(domain);
    setDomainName('');
    setDomainValue('');
    setOwnerConfirmed(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
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
  );
};
