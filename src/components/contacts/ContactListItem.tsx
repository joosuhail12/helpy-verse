
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { Contact } from '@/types/contact';
import { Badge } from '@/components/ui/badge';
import { MoreVertical } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleSelectContact, selectContact } from '@/store/slices/contacts/contactsSlice';
import { useAppSelector } from '@/hooks/useAppSelector';

interface ContactListItemProps {
  contact: Contact;
  onClick: () => void;
}

const ContactListItem: React.FC<ContactListItemProps> = ({ contact, onClick }) => {
  const dispatch = useAppDispatch();
  const selectedContacts = useAppSelector((state) => state.contacts?.selectedContacts || []);
  const isSelected = selectedContacts.includes(contact.id);

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleSelectContact(contact.id));
  };

  const handleRowClick = () => {
    dispatch(selectContact(contact.id));
    onClick();
  };

  return (
    <TableRow
      onClick={handleRowClick}
      className="cursor-pointer hover:bg-muted/50"
    >
      <TableCell className="w-12" onClick={handleCheckboxChange}>
        <Checkbox checked={isSelected} />
      </TableCell>
      <TableCell>
        <div className="font-medium">{contact.firstname} {contact.lastname}</div>
        <div className="text-sm text-muted-foreground">{contact.email}</div>
      </TableCell>
      <TableCell>{contact.company || '-'}</TableCell>
      <TableCell>
        <Badge
          variant={contact.status === 'active' ? 'default' : 'secondary'}
          className="capitalize"
        >
          {contact.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ContactListItem;
