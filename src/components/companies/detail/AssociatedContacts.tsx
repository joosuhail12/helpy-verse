
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCustomers, updateContactCompany } from '@/store/slices/contacts/contactsSlice';
import { Contact } from '@/types/contact';
import { MoreVertical, Plus, Loader2, User, Users, Search, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface AssociatedContactsProps {
  companyId: string;
}

const AssociatedContacts: React.FC<AssociatedContactsProps> = ({ companyId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [associatedContacts, setAssociatedContacts] = useState<Contact[]>([]);
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const contacts = useAppSelector((state) => state.contacts.contacts);
  const loading = useAppSelector((state) => state.contacts.loading);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchCustomers())
      .unwrap()
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  const fetchAssociatedContacts = () => {
    const associated = contacts.filter(contact => contact.company === companyId);
    setAssociatedContacts(associated);

    const available = contacts.filter(contact => !contact.company);
    setAvailableContacts(available);
  };

  useEffect(() => {
    if (contacts.length > 0) {
      fetchAssociatedContacts();
    }
  }, [contacts, companyId]);

  const filteredContacts = availableContacts.filter(contact => {
    const firstName = contact.firstname.toLowerCase();
    const lastName = contact.lastname.toLowerCase();
    const email = contact.email.toLowerCase();
    const query = debouncedSearchQuery.toLowerCase();
    
    return firstName.includes(query) || lastName.includes(query) || email.includes(query);
  });

  const handleAssociateContact = (contactId: string) => {
    dispatch(
      updateContactCompany({
        contactId,
        companyId
      })
    );
    
    // Refresh associated contacts
    fetchAssociatedContacts();
    
    // Close popover
    setIsPopoverOpen(false);
    // Clear search query
    setSearchQuery('');
  };

  const handleRemoveAssociation = (contactId: string) => {
    dispatch(
      updateContactCompany({
        contactId,
        companyId: null
      })
    );
    fetchAssociatedContacts();
  };

  const handleViewContactDetail = (contactId: string) => {
    navigate(`/home/contacts/${contactId}`);
  };

  if (isLoading || loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center h-40">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading contacts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          Associated Contacts
        </CardTitle>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Associate Contact
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px]">
            <Command>
              <CommandInput 
                placeholder="Search contacts..." 
                value={searchQuery} 
                onValueChange={setSearchQuery}
                className="h-9"
              />
              <CommandList>
                <CommandEmpty className="py-6 text-center text-sm">
                  {filteredContacts.length === 0 ? (
                    <span>No available contacts found</span>
                  ) : (
                    <span>Searching...</span>
                  )}
                </CommandEmpty>
                <CommandGroup>
                  {filteredContacts.slice(0, 5).map(contact => (
                    <CommandItem
                      key={contact.id}
                      value={`${contact.firstname} ${contact.lastname}`}
                      onSelect={() => handleAssociateContact(contact.id)}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <span className="font-medium">{contact.firstname} {contact.lastname}</span>
                        <p className="text-xs text-muted-foreground">{contact.email}</p>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </CardHeader>

      <CardContent>
        {associatedContacts.length === 0 ? (
          <div className="py-8 text-center border rounded-md bg-muted/20">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground mb-4">No contacts associated with this company</p>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Associate Contact
                </Button>
              </PopoverTrigger>
            </Popover>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {associatedContacts.map(contact => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium cursor-pointer" onClick={() => handleViewContactDetail(contact.id)}>
                    {contact.firstname} {contact.lastname}
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                      {contact.status}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewContactDetail(contact.id)}>
                          View Contact
                        </DropdownMenuItem>
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
        )}
      </CardContent>
    </Card>
  );
};

export default AssociatedContacts;
