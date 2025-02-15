
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const handleQuickTag = () => {
    // This would be implemented in a real app to handle quick tag assignment
    console.log('Quick tag for selected contacts:', selectedContacts);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedContacts.length === contacts.length && contacts.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-gray-500">
            {selectedContacts.length > 0 && (
              `${selectedContacts.length} selected`
            )}
          </span>
        </div>
        {selectedContacts.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleQuickTag}
                >
                  <TagIcon className="h-4 w-4 mr-2" />
                  Quick Tag
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quickly assign tags to selected contacts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
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

