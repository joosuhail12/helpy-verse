
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { 
  selectAllContacts, 
  selectContactsLoading, 
  selectContactsError,
  fetchCustomers
} from '@/store/slices/contacts/contactsSlice';
import { ContactList } from '@/components/contacts/ContactList';
import { ContactsHeader } from '@/components/contacts/ContactsHeader';
import { ContactListControls } from '@/components/contacts/ContactListControls';
import { LoadingState } from '@/components/contacts/LoadingState';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ContactsAll = () => {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector(selectAllContacts);
  const loading = useAppSelector(selectContactsLoading);
  const error = useAppSelector(selectContactsError);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (contacts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No contacts found</h3>
          <p className="text-muted-foreground mb-4">
            You haven't added any contacts yet or none match your current filters.
          </p>
          <Button>Add Your First Contact</Button>
        </div>
      );
    }

    return <ContactList contacts={contacts} />;
  };

  return (
    <div className="space-y-4 p-4 md:p-8">
      <ContactsHeader />
      <ContactListControls />
      {renderContent()}
    </div>
  );
};

export default ContactsAll;
