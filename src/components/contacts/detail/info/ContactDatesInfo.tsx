
import { Contact } from '@/types/contact';
import { format } from 'date-fns';

interface ContactDatesInfoProps {
  contact: Contact;
}

export const ContactDatesInfo = ({ contact }: ContactDatesInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Created</p>
        <p className="text-sm py-1 px-2">
          {format(new Date(contact.createdAt), 'MMM dd, yyyy')}
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Last Contact</p>
        <p className="text-sm py-1 px-2">
          {contact.lastContacted 
            ? format(new Date(contact.lastContacted), 'MMM dd, yyyy')
            : '-'}
        </p>
      </div>
    </div>
  );
};

