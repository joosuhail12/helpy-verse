
import { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Mail, Phone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { deleteContact, updateContact } from '@/store/slices/contacts/contactsSlice';
import { formatDistanceToNow } from 'date-fns';
import { Contact } from '@/types/contact';

interface ContactListItemProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
}

export const ContactListItem = ({ contact, isSelected, onSelect }: ContactListItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const contactTags = useAppSelector(state => state.contacts?.tags);

  const handleSelect = (checked: boolean) => {
    onSelect(contact.id, checked);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this contact?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteContact(contact.id));
      } catch (error) {
        console.error('Failed to delete contact:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await dispatch(updateContact({
        contactId: contact.id,
        data: { status }
      }));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Extract company name safely
  const companyName = typeof contact.company === 'object' 
    ? contact.company?.name 
    : '';

  return (
    <TableRow className={isDeleting ? 'opacity-50' : ''}>
      <TableCell className="w-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelect}
          aria-label="Select contact"
        />
      </TableCell>
      <TableCell 
        className="font-medium cursor-pointer"
        onClick={() => navigate(`/home/contacts/detail/${contact.id}`)}
      >
        {contact.firstname} {contact.lastname}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span>{contact.email}</span>
        </div>
        {contact.phone && (
          <div className="flex items-center gap-1 mt-1">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{contact.phone}</span>
          </div>
        )}
      </TableCell>
      <TableCell>{companyName}</TableCell>
      <TableCell>
        <Badge
          variant={
            contact.status === 'active' ? 'default' :
            contact.status === 'inactive' ? 'secondary' :
            contact.status === 'lead' ? 'outline' : 'secondary'
          }
        >
          {contact.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {contact.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {(contact.tags?.length || 0) > 2 && (
            <Badge variant="outline" className="text-xs">
              +{(contact.tags?.length || 0) - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        {contact.lastActivity ? (
          formatDistanceToNow(new Date(contact.lastActivity), { addSuffix: true })
        ) : (
          <span className="text-muted-foreground">Never</span>
        )}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate(`/home/contacts/detail/${contact.id}`)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/home/contacts/edit/${contact.id}`)}
            >
              Edit Contact
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleStatusChange('active')}>
              Mark as Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('inactive')}>
              Mark as Inactive
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete Contact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
