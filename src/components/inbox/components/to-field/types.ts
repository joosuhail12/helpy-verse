
import { Contact } from '@/types/contact';

export type Recipient = Contact | { id: string; email: string; isNew?: boolean };

export interface ToFieldProps {
  selectedRecipients: Recipient[];
  onChange: (recipients: Recipient[]) => void;
}

export interface RecipientBadgeProps {
  recipient: Recipient;
  onRemove: (id: string) => void;
}

export interface RecipientInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSelect: (contactId: string) => void;
  contacts: Contact[];
  onCreateNewContact: () => void;
  selectedRecipients: Recipient[];
}
