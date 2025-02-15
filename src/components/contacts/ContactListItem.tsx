
import { Contact } from '@/types/contact';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ContactListItemProps {
  contact: Contact;
}

export const ContactListItem = ({ contact }: ContactListItemProps) => {
  return (
    <TableRow>
      <TableCell>
        <input type="checkbox" className="rounded border-gray-300" />
      </TableCell>
      <TableCell>
        {contact.firstName} {contact.lastName}
      </TableCell>
      <TableCell>{contact.email}</TableCell>
      <TableCell>{contact.company || '-'}</TableCell>
      <TableCell>
        <Badge variant={contact.type === 'customer' ? 'default' : 'secondary'}>
          {contact.type}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={contact.status === 'active' ? 'success' : 'destructive'}>
          {contact.status}
        </Badge>
      </TableCell>
      <TableCell>
        {contact.lastContacted 
          ? format(new Date(contact.lastContacted), 'MMM dd, yyyy')
          : '-'}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
