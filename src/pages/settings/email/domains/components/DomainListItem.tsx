
import { Check, X } from 'lucide-react';
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
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <button
            className="font-medium hover:underline"
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
            onClick={() => onVerify(domain.id)}
          >
            <Check className="h-4 w-4 mr-1" />
            Verify
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => onDelete(domain.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
