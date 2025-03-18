import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchCustomers, updateContactCompany } from '@/store/slices/contacts/contactsSlice';
import { Contact } from '@/types/contact';
import { MoreVertical, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AssociatedContactsProps {
  companyId: string;
}

const AssociatedContacts: React.FC<AssociatedContactsProps> = ({ companyId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [associatedContacts, setAssociatedContacts] = useState<Contact[]>([]);
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  const [associateDialogOpen, setAssociateDialogOpen] = useState(false);
  const contacts = useAppSelector((state) => state.contacts.contacts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const fetchAssociatedContacts = () => {
    const associated = contacts.filter(contact => contact.companyId === companyId);
    setAssociatedContacts(associated);

    const available = contacts.filter(contact => !contact.companyId);
    setAvailableContacts(available);
  };

  useEffect(() => {
    if (contacts.length > 0) {
      fetchAssociatedContacts();
    }
  }, [contacts, companyId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredContacts = availableContacts.filter(contact =>
    contact.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssociateContact = (contactId: string) => {
    dispatch(
      updateContactCompany({
        id: contactId,
        data: { companyId: companyId }  // Use companyId instead of company object
      })
    );
    
    // Refresh associated contacts
    fetchAssociatedContacts();
    
    // Close dialog
    setAssociateDialogOpen(false);
  };

  const handleRemoveAssociation = (contactId: string) => {
    dispatch(
      updateContactCompany({
        id: contactId,
        data: { companyId: null }
      })
    );
    fetchAssociatedContacts();
  };

  return (
    <div>
      <h3>Associated Contacts</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {associatedContacts.map(contact => (
            <TableRow key={contact.id}>
              <TableCell>{contact.firstName} {contact.lastName}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleRemoveAssociation(contact.id)}>
                      Remove Association
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={associateDialogOpen} onOpenChange={setAssociateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Associate Contact
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Associate Contact</DialogTitle>
          </DialogHeader>
          <Input
            type="search"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map(contact => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleAssociateContact(contact.id)}>Associate</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssociatedContacts;
