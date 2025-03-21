
import { Globe, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Domain } from '@/types/domains';

interface DomainBadgeProps {
  status: Domain['isVerified'];
}

export const DomainBadge = ({ status }: DomainBadgeProps) => {
  const isVerified = status === true;
  const variants = {
    verified: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    // failed: 'bg-red-100 text-red-800 border-red-200',
  };

  const icons = {
    verified: ShieldCheck,
    pending: Globe,
    // failed: ShieldAlert,
  };

  const Icon = status ? icons.verified : icons.pending;

  return (
    <Badge variant="outline" className={`${isVerified ? variants.verified : variants.pending} gap-1`}>
      <Icon className="h-3 w-3" />
      {isVerified ? 'Verified' : 'Pending'}
    </Badge>
  );
};
