
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { RecipientInputProps } from './types';

const RecipientInput = ({ 
  inputValue, 
  onInputChange, 
  onKeyDown,
  isOpen, 
  setIsOpen, 
  onSelect, 
  contacts, 
  onCreateNewContact, 
  selectedRecipients 
}: RecipientInputProps) => {
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Filter contacts based on the input value
  const filteredContacts = contacts.filter(contact => {
    const searchTerm = inputValue.toLowerCase();
    const fullName = `${contact.firstname || ''} ${contact.lastname || ''}`.toLowerCase();
    const email = contact.email.toLowerCase();
    return fullName.includes(searchTerm) || email.includes(searchTerm);
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={isOpen}
          className="flex-1 h-8 justify-start px-2 text-left font-normal"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedRecipients.length === 0 
            ? "Select recipients or type email..." 
            : <span className="text-gray-400">Add more...</span>}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search contacts or enter email..."
            value={inputValue}
            onValueChange={onInputChange}
            onKeyDown={onKeyDown}
            autoFocus
          />
          <CommandList>
            <CommandEmpty>
              {isValidEmail(inputValue) ? (
                <Button
                  variant="outline"
                  className="w-full mt-1"
                  onClick={onCreateNewContact}
                >
                  Add "{inputValue}" as new contact
                </Button>
              ) : (
                "No contacts found or enter a valid email"
              )}
            </CommandEmpty>
            <CommandGroup heading="Contacts">
              {filteredContacts.map((contact) => (
                <CommandItem
                  key={contact.id}
                  value={contact.id}
                  onSelect={() => onSelect(contact.id)}
                  className="flex justify-between cursor-pointer"
                >
                  <div className="flex justify-between w-full">
                    <span>{contact.firstname || ''} {contact.lastname || ''}</span>
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
  );
};

export default RecipientInput;
