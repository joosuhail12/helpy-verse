
import { Contact } from '@/types/contact';

export interface ContactsState {
  items: Contact[];
<<<<<<< HEAD
  contacts: Contact[];
  contactDetails: Contact | null;
=======
  contacts: Contact[];  // Add this property
  contactDetails: Contact | null;  // Add this property
>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)
  selectedContact: Contact | null;
  selectedContacts: string[];
  loading: boolean;
  error: string | null;
<<<<<<< HEAD
  lastFetchTime: number | null;
=======
  lastFetchTime: number | null;  // Add this property
>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)
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
