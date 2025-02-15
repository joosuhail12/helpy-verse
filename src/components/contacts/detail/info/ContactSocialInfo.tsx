
import { Contact } from '@/types/contact';
import { InlineEditField } from '../InlineEditField';
import { Linkedin, Twitter } from 'lucide-react';

interface ContactSocialInfoProps {
  contact: Contact;
}

export const ContactSocialInfo = ({ contact }: ContactSocialInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Linkedin className="h-4 w-4 text-purple-900/70" />
          <p className="text-sm font-medium text-purple-900/70">LinkedIn</p>
        </div>
        <InlineEditField
          value={contact.linkedinUrl || ''}
          contactId={contact.id}
          field="linkedinUrl"
          label="LinkedIn URL"
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Twitter className="h-4 w-4 text-purple-900/70" />
          <p className="text-sm font-medium text-purple-900/70">Twitter</p>
        </div>
        <InlineEditField
          value={contact.twitterUrl || ''}
          contactId={contact.id}
          field="twitterUrl"
          label="Twitter URL"
        />
      </div>
    </div>
  );
};
