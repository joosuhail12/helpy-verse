
import { Check, X, ExternalLink, Globe, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isPast, addDays } from 'date-fns';
import type { Domain } from '@/mock/domains';
import { DomainBadge } from '../DomainBadge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const { toast } = useToast();
  const isExpiringSoon = isPast(addDays(new Date(domain.dateAdded), 365));
  
  return (
    <div className={cn(
      "flex items-center justify-between p-6 transition-all group",
      "hover:bg-muted/50 hover:shadow-sm",
      "rounded-lg mx-2 my-1",
      selected && "bg-primary/5",
      isExpiringSoon && "bg-red-50/50"
    )}>
      <div className="flex items-center gap-4">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(domain.id, checked as boolean)}
          className={cn(
            "transition-opacity",
            !selected && "opacity-50 group-hover:opacity-100"
          )}
        />
        <div className={cn(
          "p-2.5 rounded-lg transition-colors",
          selected ? "bg-primary/10" : "bg-muted"
        )}>
          <Globe className={cn(
            "h-4 w-4",
            selected ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <button
              className={cn(
                "text-base font-medium transition-colors",
                "hover:text-primary focus:text-primary focus:outline-none",
                "hover:underline focus:underline",
                selected && "text-primary"
              )}
              onClick={() => onNavigate(domain.id)}
            >
              {domain.domain}
            </button>
            <DomainBadge status={domain.status} />
            {isExpiringSoon && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs font-medium text-destructive animate-pulse">
                    <AlertTriangle className="h-3 w-3" />
                    Expiring soon
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This domain will expire soon. Please renew it to continue using it.</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Added on {format(new Date(domain.dateAdded), 'MMM d, yyyy')}
          </p>
          {domain.status === 'failed' && domain.error && (
            <p className="text-sm text-destructive mt-1">{domain.error}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate(domain.id)}
          className={cn(
            "transition-all",
            "opacity-0 group-hover:opacity-100",
            "hover:bg-background hover:text-primary"
          )}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Manage
        </Button>
        {domain.status === 'pending' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVerify(domain.id)}
            className={cn(
              "transition-all",
              "opacity-0 group-hover:opacity-100",
              "hover:bg-primary/10 hover:text-primary hover:border-primary/20"
            )}
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
