
import { useState, useEffect } from 'react';
import { X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCustomers } from '@/store/slices/contacts/contactsSlice';
import { selectContacts } from '@/store/slices/contacts/contactsSelectors';
import { Contact } from '@/types/contact';
import { v4 as uuidv4 } from 'uuid';
import RecipientInput from './to-field/RecipientInput';

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
      setOpen(false);
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

        <RecipientInput 
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          isOpen={open}
          setIsOpen={setOpen}
          onSelect={handleSelect}
          contacts={contacts}
          onCreateNewContact={handleCreateNewContact}
          selectedRecipients={selectedRecipients}
        />
      </div>
    </div>
  );
}

export default ToField;
