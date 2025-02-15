
import { Contact } from '@/types/contact';
import { InlineEditField } from '../InlineEditField';

interface ContactCommunicationInfoProps {
  contact: Contact;
}

export const ContactCommunicationInfo = ({ contact }: ContactCommunicationInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Email</p>
        <InlineEditField
          value={contact.email}
          contactId={contact.id}
          field="email"
          label="Email"
          type="email"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Phone</p>
        <InlineEditField
          value={contact.phone || ''}
          contactId={contact.id}
          field="phone"
          label="Phone"
          type="tel"
        />
      </div>
    </div>
  );
};
