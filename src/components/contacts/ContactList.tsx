
import { useEffect } from 'react';
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
import { selectContact, fetchCustomers, setSelectedContacts } from '@/store/slices/contacts/contactsSlice';
import { useAppSelector } from '@/hooks/useAppSelector';

interface ContactListProps {
  contacts: Contact[];
  loading?: boolean;
}

const ContactList = ({ contacts, loading = false }: ContactListProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedContacts } = useAppSelector(state => state.contacts);

  useEffect(() => {
    if (contacts.length === 0 && !loading) {
      console.log('No contacts found, fetching customers');
      dispatch(fetchCustomers());
    }
  }, [dispatch, contacts.length, loading]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      dispatch(setSelectedContacts(contacts.map(contact => contact.id)));
    } else {
      dispatch(setSelectedContacts([]));
    }
  };

  const handleContactClick = (contact: Contact) => {
    dispatch(selectContact(contact.id));
    navigate(`/home/contacts/${contact.id}`);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading contacts...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="p-6 text-center border rounded-md">
        <p className="text-muted-foreground">No contacts found</p>
        <Button 
          onClick={() => dispatch(fetchCustomers())} 
          className="mt-4"
          variant="outline"
        >
          Refresh Contacts
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-md">
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
  );
};

export default ContactList;
