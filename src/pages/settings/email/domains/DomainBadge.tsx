
import { Globe, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Domain } from '@/mock/domains';

interface DomainBadgeProps {
  status: Domain['status'];
}

export const DomainBadge = ({ status }: DomainBadgeProps) => {
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
