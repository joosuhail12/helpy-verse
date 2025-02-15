
import { Contact } from '@/types/contact';
import { Badge } from '@/components/ui/badge';

interface ContactStatusInfoProps {
  contact: Contact;
}

export const ContactStatusInfo = ({ contact }: ContactStatusInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Type</p>
        <Badge 
          variant={contact.type === 'customer' ? 'default' : 'secondary'}
          className="mt-1 text-xs font-medium"
        >
          {contact.type}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Status</p>
        <Badge 
          variant={contact.status === 'active' ? 'default' : 'destructive'}
          className="mt-1 text-xs font-medium"
        >
          {contact.status}
        </Badge>
      </div>
    </div>
  );
};

