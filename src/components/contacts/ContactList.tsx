
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

interface ContactListProps {
  contacts: Contact[];
  loading: boolean;
}

export const ContactList = ({ contacts, loading }: ContactListProps) => {
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input type="checkbox" className="rounded border-gray-300" />
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
            <ContactListItem key={contact.id} contact={contact} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
