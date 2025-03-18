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
import { Contact } from '@/types/contact';
import ContactListItem from './ContactListItem';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { selectContact, fetchContacts } from '@/store/slices/contacts/contactsSlice';
import { useAppSelector } from '@/hooks/useAppSelector';
import { CACHE_DURATION } from '@/store/slices/contacts/types';

const ContactList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, loading, error, lastFetchTime, selectedContacts } = useAppSelector(
    (state) => state.contacts
  );

  useEffect(() => {
    const shouldFetch = !lastFetchTime || Date.now() - lastFetchTime > CACHE_DURATION;
    if (shouldFetch && !loading) {
      dispatch(fetchContacts());
    }
  }, [dispatch, lastFetchTime, loading]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Logic to select all contacts
    } else {
      // Logic to deselect all contacts
    }
  };

  const handleContactClick = (contact: Contact) => {
    dispatch(selectContact(contact.id));
    navigate(`/home/contacts/${contact.id}`);
  };

  if (loading && items.length === 0) {
    return <div>Loading contacts...</div>;
  }

  if (error) {
    return <div>Error loading contacts: {error}</div>;
  }

  if (items.length === 0) {
    return <div>No contacts found</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                onCheckedChange={handleSelectAll}
                checked={selectedContacts.length > 0 && selectedContacts.length === items.length}
              />
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((contact) => (
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
