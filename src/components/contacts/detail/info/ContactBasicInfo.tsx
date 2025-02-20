
import { Contact } from '@/types/contact';
import { InlineEditField } from '../InlineEditField';

interface ContactBasicInfoProps {
  contact: Contact;
}

export const ContactBasicInfo = ({ contact }: ContactBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-purple-900/70">First Name</p>
        <InlineEditField
          value={contact.firstname}
          contactId={contact.id}
          field="firstname"
          label="First Name"
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-purple-900/70">Last Name</p>
        <InlineEditField
          value={contact.lastname}
          contactId={contact.id}
          field="lastname"
          label="Last Name"
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-purple-900/70">Title</p>
        <InlineEditField
          value={contact.title || ''}
          contactId={contact.id}
          field="title"
          label="Title"
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-purple-900/70">Department</p>
        <InlineEditField
          value={contact.department || ''}
          contactId={contact.id}
          field="department"
          label="Department"
        />
      </div>
    </div>
  );
};
