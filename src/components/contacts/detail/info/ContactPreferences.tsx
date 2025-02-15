
import { Contact } from '@/types/contact';
import { InlineEditField } from '../InlineEditField';
import { Globe2, Users, MapPin } from 'lucide-react';

interface ContactPreferencesProps {
  contact: Contact;
}

export const ContactPreferences = ({ contact }: ContactPreferencesProps) => {
  return (
    <div className="space-y-6">
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
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-purple-900/70" />
          <p className="text-sm font-medium text-purple-900/70">Address</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <p className="text-sm font-medium text-purple-900/70">Street</p>
            <InlineEditField
              value={contact.street || ''}
              contactId={contact.id}
              field="street"
              label="Street"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-purple-900/70">City</p>
            <InlineEditField
              value={contact.city || ''}
              contactId={contact.id}
              field="city"
              label="City"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-purple-900/70">State</p>
            <InlineEditField
              value={contact.state || ''}
              contactId={contact.id}
              field="state"
              label="State"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-purple-900/70">Postal Code</p>
            <InlineEditField
              value={contact.postalCode || ''}
              contactId={contact.id}
              field="postalCode"
              label="Postal Code"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-purple-900/70">Country</p>
            <InlineEditField
              value={contact.country || ''}
              contactId={contact.id}
              field="country"
              label="Country"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

