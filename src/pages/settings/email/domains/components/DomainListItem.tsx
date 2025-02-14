
import { Check, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import type { Domain } from '@/mock/domains';
import { DomainBadge } from '../DomainBadge';

interface DomainListItemProps {
  domain: Domain;
  onVerify: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (id: string) => void;
}

export const DomainListItem = ({ domain, onVerify, onDelete, onNavigate }: DomainListItemProps) => {
  return (
    <div className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <button
            className="text-lg font-medium hover:underline hover:text-primary transition-colors"
            onClick={() => onNavigate(domain.id)}
          >
            {domain.domain}
          </button>
          <DomainBadge status={domain.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          Added on {format(new Date(domain.dateAdded), 'MMM d, yyyy')}
        </p>
        {domain.status === 'pending' && (
          <div className="mt-2">
            <p className="text-sm font-medium text-muted-foreground mb-1">Verification Record:</p>
            <code className="px-3 py-1 bg-muted rounded-md text-xs font-mono">
              {domain.verificationRecord}
            </code>
          </div>
        )}
        {domain.status === 'failed' && domain.error && (
          <p className="text-sm text-destructive mt-1">{domain.error}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate(domain.id)}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Manage
        </Button>
        {domain.status === 'pending' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVerify(domain.id)}
          >
            <Check className="h-4 w-4 mr-1" />
            Verify
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(domain.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
