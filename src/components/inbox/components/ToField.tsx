
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, X, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCustomers } from '@/store/slices/contacts/contactsSlice';
import { selectContacts } from '@/store/slices/contacts/contactsSelectors';
import { Contact } from '@/types/contact';
import { v4 as uuidv4 } from 'uuid';

interface ToFieldProps {
  selectedRecipients: Array<Contact | { id: string; email: string; isNew?: boolean }>;
  onChange: (recipients: Array<Contact | { id: string; email: string; isNew?: boolean }>) => void;
}

export function ToField({ selectedRecipients, onChange }: ToFieldProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const dispatch = useAppDispatch();
  const contacts = useAppSelector(selectContacts);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSelect = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact && !selectedRecipients.some(r => r.id === contactId)) {
      onChange([...selectedRecipients, contact]);
      setInputValue('');
    }
  };

  const handleCreateNewContact = () => {
    if (isValidEmail(inputValue) && !selectedRecipients.some(r => r.email === inputValue)) {
      // Create a temporary contact object
      const newContact = { 
        id: uuidv4(), 
        email: inputValue,
        isNew: true
      };
      onChange([...selectedRecipients, newContact]);
      setInputValue('');
      setOpen(false);
    }
  };

  const handleRemoveRecipient = (id: string) => {
    onChange(selectedRecipients.filter(r => r.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue && isValidEmail(inputValue)) {
      e.preventDefault();
      handleCreateNewContact();
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-1 p-1 border rounded-md mb-1">
        {selectedRecipients.map((recipient) => (
          <Badge 
            key={recipient.id} 
            variant="secondary" 
            className="flex items-center gap-1 py-1 px-2"
          >
            {'firstname' in recipient ? (
              `${recipient.firstname} ${recipient.lastname}`
            ) : (
              <span className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                {recipient.email}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => handleRemoveRecipient(recipient.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="flex-1 h-8 justify-start px-2 text-left font-normal"
            >
              {selectedRecipients.length === 0 
                ? "Select recipients or type email..." 
                : <span className="text-gray-400">Add more...</span>}
              <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput 
                placeholder="Search contacts or enter email..."
                value={inputValue}
                onValueChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <CommandList>
                <CommandEmpty>
                  {isValidEmail(inputValue) ? (
                    <Button
                      variant="outline"
                      className="w-full mt-1"
                      onClick={handleCreateNewContact}
                    >
                      Add "{inputValue}" as new contact
                    </Button>
                  ) : (
                    "No contacts found or enter a valid email"
                  )}
                </CommandEmpty>
                <CommandGroup heading="Contacts">
                  {contacts.map((contact) => (
                    <CommandItem
                      key={contact.id}
                      value={`${contact.firstname} ${contact.lastname} ${contact.email}`}
                      onSelect={() => handleSelect(contact.id)}
                    >
                      <div className="flex justify-between w-full">
                        <span>{contact.firstname} {contact.lastname}</span>
                        <span className="text-xs text-gray-500">{contact.email}</span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedRecipients.some(r => r.id === contact.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default ToField;
