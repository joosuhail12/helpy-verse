
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Contact } from '@/types/contact';

interface ContactsTableProps {
  contacts: Contact[];
  onRemoveAssociation: (contactId: string) => void;
}

const ContactsTable: React.FC<ContactsTableProps> = ({ contacts, onRemoveAssociation }) => {
  const navigate = useNavigate();

  const handleViewContactDetail = (contactId: string) => {
    navigate(`/home/contacts/${contactId}`);
  };

  return (
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
        {contacts.map(contact => (
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
                  <DropdownMenuItem onClick={() => onRemoveAssociation(contact.id)}>
                    Remove Association
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ContactsTable;
