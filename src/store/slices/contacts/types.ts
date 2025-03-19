
import { Contact } from '@/types/contact';

export interface ContactsState {
  items: Contact[];
  contacts: Contact[];
  contactDetails: Contact | null;
  selectedContact: Contact | null;
  selectedContacts: string[];
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  filters: {
    type: string | null;
    status: string | null;
    search: string;
  };
  sort: {
    field: keyof Contact;
    direction: 'asc' | 'desc';
  };
}
