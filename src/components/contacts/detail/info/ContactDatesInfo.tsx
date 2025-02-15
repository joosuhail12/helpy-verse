
import { Contact } from '@/types/contact';
import { InlineEditField } from '../InlineEditField';

interface ContactDatesInfoProps {
  contact: Contact;
}

export const ContactDatesInfo = ({ contact }: ContactDatesInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-purple-900/70">Created</p>
        <InlineEditField
          value={new Date(contact.createdAt).toISOString().split('T')[0]}
          contactId={contact.id}
          field="createdAt"
          label="Created At"
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-purple-900/70">Last Contact</p>
        <InlineEditField
          value={contact.lastContacted ? new Date(contact.lastContacted).toISOString().split('T')[0] : ''}
          contactId={contact.id}
          field="lastContacted"
          label="Last Contacted"
        />
      </div>
    </div>
  );
};
