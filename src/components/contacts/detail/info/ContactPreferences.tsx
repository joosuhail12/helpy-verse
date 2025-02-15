
import { Contact } from '@/types/contact';
import { InlineEditField } from '../InlineEditField';
import { Globe2, Users } from 'lucide-react';

interface ContactPreferencesProps {
  contact: Contact;
}

export const ContactPreferences = ({ contact }: ContactPreferencesProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Globe2 className="h-4 w-4 text-purple-900/70" />
          <p className="text-sm font-medium text-purple-900/70">Timezone</p>
        </div>
        <InlineEditField
          value={contact.timezone || ''}
          contactId={contact.id}
          field="timezone"
          label="Timezone"
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-purple-900/70" />
          <p className="text-sm font-medium text-purple-900/70">Source</p>
        </div>
        <InlineEditField
          value={contact.source || ''}
          contactId={contact.id}
          field="source"
          label="Source"
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-purple-900/70">Language</p>
        <InlineEditField
          value={contact.preferredLanguage || ''}
          contactId={contact.id}
          field="preferredLanguage"
          label="Preferred Language"
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-purple-900/70">Next Follow-up</p>
        <InlineEditField
          value={contact.nextFollowUp || ''}
          contactId={contact.id}
          field="nextFollowUp"
          label="Next Follow-up"
        />
      </div>
    </div>
  );
};
