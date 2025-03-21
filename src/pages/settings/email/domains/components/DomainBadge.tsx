
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, Clock, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DomainBadgeProps {
  status: 'pending' | 'verified' | 'failed';
  className?: string;
}

export const DomainBadge = ({ status, className }: DomainBadgeProps) => {
  const variants = {
    pending: {
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
      icon: Clock,
      tooltip: "Domain verification is pending. Add the verification record to your DNS settings."
    },
    verified: {
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
      icon: Check,
      tooltip: "Domain is verified and ready to use."
    },
    failed: {
      className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
      icon: AlertTriangle,
      tooltip: "Domain verification failed. Please check your DNS settings and try again."
    },
  };

  const Icon = variants[status].icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          className={cn(
            variants[status].className,
            "inline-flex items-center gap-1 font-medium px-2 py-0.5",
            className
          )} 
          variant="secondary"
        >
          <Icon className="h-3 w-3" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{variants[status].tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default DomainBadge;

