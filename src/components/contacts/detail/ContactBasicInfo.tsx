
import { Contact } from '@/types/contact';
import { Badge } from '@/components/ui/badge';
import { InlineEditField } from './InlineEditField';

interface ContactBasicInfoProps {
  contact: Contact;
}

export const ContactBasicInfo = ({ contact }: ContactBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Customer Type</p>
        <Badge 
          variant={contact.type === 'customer' ? 'default' : 'secondary'}
          className="mt-1"
        >
          {contact.type === 'customer' ? 'Customer' : 'Visitor'}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">First Name</p>
        <InlineEditField
          value={contact.firstname}
          contactId={contact.id}
          fieldName="firstname"
          label="First Name"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Last Name</p>
        <InlineEditField
          value={contact.lastname}
          contactId={contact.id}
          fieldName="lastname"
          label="Last Name"
        />
      </div>
    </div>
  );
};
