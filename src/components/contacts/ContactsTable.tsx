import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import type { Contact } from '@/types/contact';

interface ContactsTableProps {
  contacts: Contact[];
}

const ContactsTable: React.FC<ContactsTableProps> = ({ contacts }) => {
  const navigate = useNavigate();

  if (!contacts || contacts.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No contacts found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow
            key={contact.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/home/contacts/${contact.id}`)}
          >
            <TableCell>
              <Checkbox onClick={(e) => e.stopPropagation()} />
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {contact.firstname} {contact.lastname}
              </div>
            </TableCell>
            <TableCell>{contact.email}</TableCell>
            <TableCell>
              <Badge
                variant={contact.status === 'active' ? 'default' : 'secondary'}
              >
                {contact.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  // Additional actions logic here
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ContactsTable;
