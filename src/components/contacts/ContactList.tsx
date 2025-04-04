
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import type { Contact } from '@/types/contact';
import ContactListItem from './ContactListItem';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectContact, fetchCustomers, setSelectedContacts } from '@/store/slices/contacts/contactsSlice';
import { LoadingState } from './LoadingState';

interface ContactListProps {
  contacts: Contact[];
  loading?: boolean;
}

const ContactList = ({ contacts, loading = false }: ContactListProps) => {
  console.log('ContactList rendered with', contacts?.length, 'contacts');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedContacts } = useAppSelector(state => state.contacts);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);

  useEffect(() => {
    console.log('ContactList mount - contacts:', contacts?.length, 'loading:', loading);
    
    if (!initialLoadAttempted && contacts.length === 0 && !loading) {
      console.log('No contacts found, fetching customers...');
      setInitialLoadAttempted(true);
      dispatch(fetchCustomers())
        .unwrap()
        .then((result) => {
          console.log('Fetch customers successful:', result);
        })
        .catch((error) => {
          console.error('Fetch customers failed:', error);
        });
    }
  }, [dispatch, contacts.length, loading, initialLoadAttempted]);

  const handleSelectAll = (checked: boolean) => {
    console.log('Select all toggled:', checked);
    if (checked) {
      dispatch(setSelectedContacts(contacts.map(contact => contact.id)));
    } else {
      dispatch(setSelectedContacts([]));
    }
  };

  const handleContactClick = (contact: Contact) => {
    console.log('Contact clicked:', contact.id);
    dispatch(selectContact(contact.id));
    navigate(`/home/contacts/${contact.id}`);
  };

  if (loading) {
    console.log('Rendering loading state');
    return <LoadingState />;
  }

  if (!contacts || contacts.length === 0) {
    console.log('Rendering empty state');
    return (
      <div className="p-6 text-center border rounded-md bg-white">
        <p className="text-muted-foreground">No contacts found</p>
        <Button 
          onClick={() => {
            console.log('Refresh contacts clicked');
            dispatch(fetchCustomers());
          }} 
          className="mt-4"
          variant="outline"
        >
          Refresh Contacts
        </Button>
      </div>
    );
  }

  console.log('Rendering contact list with', contacts.length, 'contacts');
  return (
    <div className="border rounded-md bg-white">
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  onCheckedChange={handleSelectAll}
                  checked={selectedContacts.length > 0 && selectedContacts.length === contacts.length}
                />
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <ContactListItem
                key={contact.id}
                contact={contact}
                onClick={() => handleContactClick(contact)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContactList;
