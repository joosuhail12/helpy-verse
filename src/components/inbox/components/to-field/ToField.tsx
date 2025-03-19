
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCustomers } from '@/store/slices/contacts/contactsSlice';
import { selectContacts } from '@/store/slices/contacts/contactsSelectors';
import { v4 as uuidv4 } from 'uuid';
import RecipientBadge from './RecipientBadge';
import RecipientInput from './RecipientInput';
import { ToFieldProps } from './types';

const ToField = ({ selectedRecipients, onChange }: ToFieldProps) => {
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
          <RecipientBadge 
            key={recipient.id}
            recipient={recipient} 
            onRemove={handleRemoveRecipient} 
          />
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
};

export default ToField;
