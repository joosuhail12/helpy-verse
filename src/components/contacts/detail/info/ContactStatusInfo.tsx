
import { Contact } from '@/types/contact';
import { Badge } from '@/components/ui/badge';
import { InlineEditField } from '../InlineEditField';

interface ContactStatusInfoProps {
  contact: Contact;
}

export const ContactStatusInfo = ({ contact }: ContactStatusInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-purple-900/70">Type</p>
        <InlineEditField
          value={contact.type}
          contactId={contact.id}
          field="type"
          label="Type"
          type="select"
          options={['visitor', 'customer']}
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-purple-900/70">Status</p>
        <InlineEditField
          value={contact.status}
          contactId={contact.id}
          field="status"
          label="Status"
          type="select"
          options={['active', 'inactive']}
        />
      </div>
    </div>
  );
};
