
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DomainBadgeProps {
  status: 'pending' | 'verified' | 'failed';
  className?: string;
}

export const DomainBadge = ({ status, className }: DomainBadgeProps) => {
  const variants = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    verified: "bg-green-100 text-green-800 hover:bg-green-100",
    failed: "bg-red-100 text-red-800 hover:bg-red-100",
  };

  return (
    <Badge className={cn(variants[status], className)} variant="secondary">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default DomainBadge;
