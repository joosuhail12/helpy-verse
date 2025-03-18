
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Contact } from '@/types/contact';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search } from 'lucide-react';

interface ContactsTableProps {
  contacts: Contact[];
}

export const ContactsTable: React.FC<ContactsTableProps> = ({ contacts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredContacts = contacts.filter(contact => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      contact.firstname.toLowerCase().includes(query) ||
      contact.lastname.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      (contact.phone && contact.phone.includes(query))
    );
  });

  const handleViewContact = (id: string) => {
    navigate(`/contacts/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  {contact.firstname} {contact.lastname}
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone || '-'}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs capitalize ${
                    contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {contact.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewContact(contact.id)}>
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No contacts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactsTable;
