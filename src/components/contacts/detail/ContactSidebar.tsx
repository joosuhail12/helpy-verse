
import React from 'react';
import { ContactDetailSidebar } from './ContactDetailSidebar';
import { CustomerSentiment } from './CustomerSentiment';
import { ContactTags } from './ContactTags';
import { Contact } from '@/types/contact';
import { useAppSelector } from '@/hooks/useAppSelector';

export const ContactSidebar = ({ contact }: { contact: Contact }) => {
  // Get activities for the contact from state
  const activities = useAppSelector((state) => 
    state.activities?.contactActivities?.[contact.id] || []
  );

  return (
    <div className="w-full lg:w-1/3 space-y-6">
      <ContactDetailSidebar contact={contact} />
      <ContactTags contact={contact} contactId={contact.id} />
      <CustomerSentiment activities={activities} />
    </div>
  );
};
