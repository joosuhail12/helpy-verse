
import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Contact } from '@/types/contact';

interface ContactSearchPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filteredContacts: Contact[];
  onAssociateContact: (contactId: string) => void;
}

const ContactSearchPopover: React.FC<ContactSearchPopoverProps> = ({
  isOpen,
  onOpenChange,
  searchQuery,
  onSearchChange,
  filteredContacts,
  onAssociateContact
}) => {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
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
            onValueChange={onSearchChange}
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
                  onSelect={() => onAssociateContact(contact.id)}
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
  );
};

export default ContactSearchPopover;
