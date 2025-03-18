
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Contact } from '@/types/contact';

interface ContactsTableProps {
  contacts: Contact[];
  selectedContactIds: string[];
  onSelectAll: () => void;
  onSelectContact: (id: string) => void;
  companyView?: boolean;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  selectedContactIds,
  onSelectAll,
  onSelectContact,
  companyView = false,
}) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof Contact>('lastname');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Contact) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (valueA === undefined || valueB === undefined) return 0;

    // Handle different types of values
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc'
        ? valueA - valueB
        : valueB - valueA;
    }

    // Default case for other types or mixed types
    return 0;
  });

  const allSelected = contacts.length > 0 && selectedContactIds.length === contacts.length;

  const handleRowClick = (id: string) => {
    navigate(`/home/contacts/${id}`);
  };

  const SortableHeader = ({ field, label }: { field: keyof Contact; label: string }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="flex items-center font-medium"
    >
      {label}
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ChevronUpIcon className="ml-1 h-4 w-4" />
        ) : (
          <ChevronDownIcon className="ml-1 h-4 w-4" />
        )
      ) : null}
    </Button>
  );

  return (
    <Table className="border rounded-md">
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all contacts"
            />
          </TableHead>
          <TableHead>
            <SortableHeader field="firstname" label="Name" />
          </TableHead>
          <TableHead>
            <SortableHeader field="email" label="Email" />
          </TableHead>
          {!companyView && (
            <TableHead>
              <SortableHeader field="company" label="Company" />
            </TableHead>
          )}
          <TableHead>
            <SortableHeader field="status" label="Status" />
          </TableHead>
          <TableHead className="text-right">
            <SortableHeader field="lastContacted" label="Last Contacted" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedContacts.map((contact) => (
          <TableRow
            key={contact.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleRowClick(contact.id)}
          >
            <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedContactIds.includes(contact.id)}
                onCheckedChange={() => onSelectContact(contact.id)}
                aria-label={`Select ${contact.firstname} ${contact.lastname}`}
              />
            </TableCell>
            <TableCell className="font-medium">
              {contact.firstname} {contact.lastname}
            </TableCell>
            <TableCell>{contact.email}</TableCell>
            {!companyView && (
              <TableCell>{contact.company || '-'}</TableCell>
            )}
            <TableCell>
              <div className="flex items-center">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    contact.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                {contact.status === 'active' ? 'Active' : 'Inactive'}
              </div>
            </TableCell>
            <TableCell className="text-right">
              {contact.lastContacted
                ? formatDistanceToNow(new Date(contact.lastContacted), { addSuffix: true })
                : 'Never'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ContactsTable;
