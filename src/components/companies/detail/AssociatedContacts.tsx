
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCustomers, updateContactCompany } from '@/store/slices/contacts/contactsSlice';
import { Contact } from '@/types/contact';
import { MoreVertical, Plus, Loader2, User, Users } from 'lucide-react';
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

interface AssociatedContactsProps {
  companyId: string;
}

const AssociatedContacts: React.FC<AssociatedContactsProps> = ({ companyId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [associatedContacts, setAssociatedContacts] = useState<Contact[]>([]);
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  const [associateDialogOpen, setAssociateDialogOpen] = useState(false);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredContacts = availableContacts.filter(contact => {
    const firstName = contact.firstname.toLowerCase();
    const lastName = contact.lastname.toLowerCase();
    const email = contact.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    
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
    
    // Close dialog
    setAssociateDialogOpen(false);
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
        <Dialog open={associateDialogOpen} onOpenChange={setAssociateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Associate Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Associate Contact</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="search"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={handleSearch}
                className="mb-4"
              />
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
                  {filteredContacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No available contacts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContacts.map(contact => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">
                          {contact.firstname} {contact.lastname}
                        </TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>
                          <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                            {contact.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => handleAssociateContact(contact.id)}>Associate</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {associatedContacts.length === 0 ? (
          <div className="py-8 text-center border rounded-md bg-muted/20">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground mb-4">No contacts associated with this company</p>
            <Dialog open={associateDialogOpen} onOpenChange={setAssociateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Associate Contact
                </Button>
              </DialogTrigger>
            </Dialog>
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
