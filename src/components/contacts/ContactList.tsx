
import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, MoreHorizontal, Check } from 'lucide-react';
import { ContactListItem } from './ContactListItem';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { Contact } from '@/types/contact';

export function ContactList() {
  const contacts = useAppSelector((state) => state.contacts.items);
  const [sort, setSort] = useState<'name' | 'updated'>('updated');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSelect, setShowSelect] = useState(false);

  const sortedContacts = [...contacts].sort((a, b) => {
    if (sort === 'name') {
      const nameA = `${a.firstname} ${a.lastname}`.toLowerCase();
      const nameB = `${b.firstname} ${b.lastname}`.toLowerCase();
      return order === 'asc' 
        ? nameA.localeCompare(nameB) 
        : nameB.localeCompare(nameA);
    } else {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  const handleSort = (field: 'name' | 'updated') => {
    if (field === sort) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field);
      setOrder('desc');
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === contacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(contacts.map(c => c.id));
    }
  };

  const handleItemClick = (contact: Contact) => {
    // Navigate to contact details or handle selection
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 items-center">
          {showSelect && (
            <Checkbox 
              checked={selectedIds.length > 0 && selectedIds.length === contacts.length}
              onCheckedChange={selectAll}
              className="ml-2"
            />
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground"
            onClick={() => handleSort('name')}
          >
            Name
            {sort === 'name' && (
              order === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground"
            onClick={() => handleSort('updated')}
          >
            Last Updated
            {sort === 'updated' && (
              order === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={showSelect}
              onCheckedChange={() => setShowSelect(!showSelect)}
            >
              Show Checkboxes
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Export Contacts
            </DropdownMenuItem>
            <DropdownMenuItem>
              Import Contacts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1">
        {sortedContacts.map(contact => (
          <ContactListItem
            key={contact.id}
            contact={contact}
            onClick={() => handleItemClick(contact)}
          />
        ))}
      </div>
    </div>
  );
}
