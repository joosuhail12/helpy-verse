
import { format, parseISO } from 'date-fns';
import { LucideIcon } from 'lucide-react';

interface TeammateTimestampFieldProps {
  label: string;
  timestamp?: string | Date;
  icon: LucideIcon;
}

export const TeammateTimestampField = ({ 
  label, 
  timestamp, 
  icon: Icon 
}: TeammateTimestampFieldProps) => {
  const formatDate = (dateValue?: string | Date) => {
    if (!dateValue) return 'Not available';
    try {
      const dateString = typeof dateValue === 'string' ? dateValue : dateValue.toISOString();
      return format(parseISO(dateString), 'PPpp');
    } catch (error) {
      console.error("Invalid date:", dateValue);
      return 'Invalid date';
    }
  };

  return (
    <div className="grid grid-cols-[25px_1fr] items-start pb-2">
      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div className="grid gap-1">
        <span className="text-sm font-medium leading-none">{label}</span>
        <span className="text-sm text-muted-foreground">{formatDate(timestamp)}</span>
      </div>
    </div>
  );
};
