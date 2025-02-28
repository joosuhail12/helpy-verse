
import { Contact } from '@/types/contact';

export interface ContactsState {
  items: Contact[];
  contacts: Contact[];  // Add this property
  contactDetails: Contact | null;  // Add this property
  selectedContact: Contact | null;
  selectedContacts: string[];
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;  // Add this property
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

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
