
import React from 'react';
import { ContactsHeader } from '@/components/contacts/ContactsHeader';
import { ContactListControls } from '@/components/contacts/ContactListControls';
import ContactsErrorBoundary from '@/components/contacts/ContactsErrorBoundary';
import BulkActions from '@/components/contacts/BulkActions';
import { ContactList } from '@/components/contacts/ContactList';

const AllContactsPage = () => {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <ContactsHeader />
      
      <div className="mt-6">
        <ContactsErrorBoundary>
          <div className="mb-4">
            <ContactListControls />
          </div>
          
          <div className="mb-4">
            <BulkActions />
          </div>
          
          <div className="bg-background border rounded-md">
            <ContactList />
          </div>
        </ContactsErrorBoundary>
      </div>
    </div>
  );
};

export default AllContactsPage;
