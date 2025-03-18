
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowDown, ArrowUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Contact } from '@/types/contact';

interface ContactsTableProps {
  contacts: Contact[];
  title?: string;
  showAddButton?: boolean;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  title = 'Contacts',
  showAddButton = true,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<keyof Contact>('lastname');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleRowClick = (contactId: string) => {
    navigate(`/home/contacts/${contactId}`);
  };

  const handleSort = (column: keyof Contact) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.firstname} ${contact.lastname}`.toLowerCase();
    const email = contact.email?.toLowerCase() || '';
    const company = contact.company?.toLowerCase() || '';
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      company.includes(searchQuery.toLowerCase())
    );
  });

  // Sort contacts based on current sort criteria
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (sortBy in a && sortBy in b) {
      const aValue = String(a[sortBy]);
      const bValue = String(b[sortBy]);
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-8 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {showAddButton && (
            <Button size="sm" onClick={() => navigate('/home/contacts/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('lastname')}
              >
                <div className="flex items-center">
                  Name
                  {sortBy === 'lastname' && (
                    sortDirection === 'asc' ? (
                      <ArrowUp className="ml-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="ml-1 h-3 w-3" />
                    )
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {sortBy === 'email' && (
                    sortDirection === 'asc' ? (
                      <ArrowUp className="ml-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="ml-1 h-3 w-3" />
                    )
                  )}
                </div>
              </TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedContacts.length > 0 ? (
              sortedContacts.map((contact) => (
                <TableRow 
                  key={contact.id} 
                  className="cursor-pointer"
                  onClick={() => handleRowClick(contact.id)}
                >
                  <TableCell>
                    {contact.firstname} {contact.lastname}
                  </TableCell>
                  <TableCell>{contact.email || '-'}</TableCell>
                  <TableCell>{contact.phone || '-'}</TableCell>
                  <TableCell>{contact.jobTitle || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                      {contact.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  {searchQuery ? 'No contacts match your search' : 'No contacts available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContactsTable;
