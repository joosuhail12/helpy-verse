
import { format } from 'date-fns';
import type { LucideIcon } from 'lucide-react';

interface TeammateTimestampFieldProps {
  label: string;
  timestamp: string | null;
  icon: LucideIcon;
}

export const TeammateTimestampField = ({
  label,
  timestamp,
  icon: Icon,
}: TeammateTimestampFieldProps) => {
  if (!timestamp) return null;
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Icon className="h-4 w-4" />
        {format(new Date(timestamp), 'PPpp')}
      </div>
    </div>
  );
};
