
import { Check, X, ExternalLink, Globe, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isPast, addDays } from 'date-fns';
import type { Domain } from '@/mock/domains';
import { DomainBadge } from '../DomainBadge';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface DomainListItemProps {
  domain: Domain;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onVerify: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (id: string) => void;
}

export const DomainListItem = ({ 
  domain, 
  selected,
  onSelect,
  onVerify, 
  onDelete, 
  onNavigate 
}: DomainListItemProps) => {
  const isExpiringSoon = isPast(addDays(new Date(domain.dateAdded), 365)); // Example: domains expire after 1 year
  
  const handleCopyRecord = () => {
    navigator.clipboard.writeText(domain.verificationRecord);
    toast({
      description: "Verification record copied to clipboard",
    });
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-6 transition-colors group",
      "hover:bg-muted/50",
      isExpiringSoon && "bg-red-50/50"
    )}>
      <div className="flex items-start gap-4">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(domain.id, checked as boolean)}
          className="mt-1"
        />
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 bg-muted rounded-lg">
            <Globe className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                className="text-lg font-medium hover:underline hover:text-primary transition-colors"
                onClick={() => onNavigate(domain.id)}
              >
                {domain.domain}
              </button>
              <DomainBadge status={domain.status} />
              {isExpiringSoon && (
                <div className="flex items-center gap-1 text-xs font-medium text-destructive">
                  <AlertTriangle className="h-3 w-3" />
                  Expiring soon
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Added on {format(new Date(domain.dateAdded), 'MMM d, yyyy')}
            </p>
            {domain.status === 'pending' && (
              <div 
                className="mt-2 group-hover:bg-white/80 transition-colors cursor-pointer"
                onClick={handleCopyRecord}
              >
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
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate(domain.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Manage
        </Button>
        {domain.status === 'pending' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVerify(domain.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Check className="h-4 w-4 mr-1" />
            Verify
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-destructive hover:text-destructive hover:bg-destructive/10",
            "opacity-0 group-hover:opacity-100 transition-opacity"
          )}
          onClick={() => onDelete(domain.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
