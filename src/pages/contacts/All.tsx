
<<<<<<< HEAD
import { useEffect, useState } from 'react';
=======
import { useEffect } from 'react';
>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCustomers } from '@/store/slices/contacts/contactsSlice';
import { selectContacts } from '@/store/slices/contacts/contactsSlice';
import { selectContactsLoading } from '@/store/slices/contacts/contactsSlice';
import { selectContactsError } from '@/store/slices/contacts/contactsSlice';
import ContactList from '@/components/contacts/ContactList';
import { ContactsHeader } from '@/components/contacts/ContactsHeader';
import { ContactListControls } from '@/components/contacts/ContactListControls';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import ContactsErrorBoundary from '@/components/contacts/ContactsErrorBoundary';
import { ScrollArea } from '@/components/ui/scroll-area';

const AllContacts = () => {
  const dispatch = useAppDispatch();
<<<<<<< HEAD
  const contacts = useAppSelector(selectContacts);
  const loading = useAppSelector(selectContactsLoading);
  const error = useAppSelector(selectContactsError);
  const [retryCount, setRetryCount] = useState(0);

=======
  const { contacts, loading, error, lastFetchTime } = useAppSelector((state) => state.contacts);
  const workspace_id = useAppSelector((state) => state.auth.user?.data.defaultWorkspaceId);
  console.log(contacts, loading, error, lastFetchTime, workspace_id);
  
>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)
  useEffect(() => {
    console.log('AllContacts component mounted, fetching customers');
    dispatch(fetchCustomers())
      .unwrap()
      .then(() => console.log('Successfully fetched contacts'))
      .catch((err) => {
        console.error('Error fetching contacts:', err);
        toast({
          title: 'Error loading contacts',
          description: err.message || 'Please try again later',
          variant: 'destructive'
        });
      });
  }, [dispatch, retryCount]);

  // Debug logging
  useEffect(() => {
    console.log('Contacts state:', {
      loading,
      contactsCount: contacts?.length,
      error,
      contactsData: contacts
    });
  }, [loading, contacts, error]);

  if (loading) {
    return (
      <div className="p-6 h-full overflow-auto">
        <Card className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-64 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 h-full overflow-auto">
        <Card className="p-4 text-red-500">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">Error loading contacts</p>
          </div>
          <p className="mb-4">{error}</p>
          <Button
            onClick={() => {
              console.log('Retrying fetch customers');
              setRetryCount(prev => prev + 1);
            }}
            className="mt-2"
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (!contacts) {
    return (
      <div className="p-6 h-full overflow-auto">
        <Card className="p-4">
          <p className="text-muted-foreground">No contacts data available</p>
          <Button
            onClick={() => {
              console.log('Loading contacts');
              setRetryCount(prev => prev + 1);
            }}
            className="mt-2"
          >
            Load Contacts
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-none p-6 space-y-6">
        <ContactsHeader />
        <ContactListControls />
      </div>
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <ContactsErrorBoundary>
            <ContactList contacts={contacts || []} loading={loading} />
          </ContactsErrorBoundary>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AllContacts;
