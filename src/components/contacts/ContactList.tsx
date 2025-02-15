
import { Contact } from '@/types/contact';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ContactListItem } from './ContactListItem';
import { LoadingState } from './LoadingState';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setSelectedContacts } from '@/store/slices/contacts/contactsSlice';

interface ContactListProps {
  contacts: Contact[];
  loading: boolean;
}

export const ContactList = ({ contacts, loading }: ContactListProps) => {
  const dispatch = useAppDispatch();
  const selectedContacts = useAppSelector(state => state.contacts.selectedContacts);

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      dispatch(setSelectedContacts([]));
    } else {
      dispatch(setSelectedContacts(contacts.map(contact => contact.id)));
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedContacts.length === contacts.length && contacts.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Contacted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <ContactListItem 
              key={contact.id} 
              contact={contact}
              isSelected={selectedContacts.includes(contact.id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
