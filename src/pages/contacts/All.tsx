
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchContacts } from '@/store/slices/contacts/contactsSlice';
import { ContactList } from '@/components/contacts/ContactList';
import { ContactsHeader } from '@/components/contacts/ContactsHeader';
import { ContactListControls } from '@/components/contacts/ContactListControls';
import { Card } from '@/components/ui/card';

const AllContacts = () => {
  const dispatch = useAppDispatch();
  const { contacts, loading, error } = useAppSelector((state) => state.contacts);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-4 text-red-500">
          Error loading contacts: {error}
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
