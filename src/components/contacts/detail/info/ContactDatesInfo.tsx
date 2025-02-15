
import { Contact } from '@/types/contact';

interface ContactDatesInfoProps {
  contact: Contact;
}

export const ContactDatesInfo = ({ contact }: ContactDatesInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-purple-900/70">Created</p>
        <p className="text-sm py-1 px-2 text-gray-600">
          {new Date(contact.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-purple-900/70">Last Contact</p>
        <p className="text-sm py-1 px-2 text-gray-600">
          {contact.lastContacted ? new Date(contact.lastContacted).toLocaleDateString() : '-'}
        </p>
      </div>
    </div>
  );
};

