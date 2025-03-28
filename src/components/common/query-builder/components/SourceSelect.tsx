
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SourceSelectProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string | null;
}

export const SourceSelect = ({
  value,
  onChange,
  errorMessage,
}: SourceSelectProps) => {
  const sources = [
    { value: 'contact', label: 'Contact' },
    { value: 'company', label: 'Company' },
    { value: 'conversation', label: 'Conversation' },
    { value: 'ticket', label: 'Ticket' },
    { value: 'event', label: 'Event' },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-[150px] ${errorMessage ? 'border-red-500' : ''}`}>
        <SelectValue placeholder="Select source" />
      </SelectTrigger>
      <SelectContent>
        {sources.map((source) => (
          <SelectItem key={source.value} value={source.value}>
            {source.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
