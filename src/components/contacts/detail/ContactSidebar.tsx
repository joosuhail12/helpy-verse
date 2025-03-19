
import React from 'react';
import { ContactDetailSidebar } from './ContactDetailSidebar';
import { CustomerSentiment } from './CustomerSentiment';
import { ContactTags } from './ContactTags';
import { Contact } from '@/types/contact';

export const ContactSidebar = ({ contact }: { contact: Contact }) => {
  return (
    <div className="w-full lg:w-1/3 space-y-6">
      <ContactDetailSidebar contact={contact} />
      <ContactTags contact={contact} contactId={contact.id} />
      <CustomerSentiment contactId={contact.id} />
    </div>
  );
};
