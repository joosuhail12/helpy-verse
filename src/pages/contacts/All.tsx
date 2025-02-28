
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCustomers } from '@/store/slices/contacts/contactsSlice';
import { ContactList } from '@/components/contacts/ContactList';
import { ContactsHeader } from '@/components/contacts/ContactsHeader';
import { ContactListControls } from '@/components/contacts/ContactListControls';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const AllContacts = () => {
  const dispatch = useAppDispatch();
  const { contacts, loading, error, lastFetchTime } = useAppSelector((state) => state.contacts);
  const workspace_id = useAppSelector((state) => state.auth.user?.data.defaultWorkspaceId);
  console.log(contacts, loading, error, lastFetchTime, workspace_id);
  
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-4">
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-8 w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-4 text-red-500">
          <p>Error loading contacts: {error}</p>
          <Button onClick={() => dispatch(fetchCustomers())} className="mt-2">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <ContactsHeader />
      <ContactListControls />
      <ContactList contacts={contacts} loading={loading} />
    </div>
  );
};

export default AllContacts;
