
import { Contact } from '@/types/contact';

export interface ContactsState {
  items: Contact[];
  contacts: Contact[];
  contactDetails: Contact | null;
  selectedContact: Contact | null;
  selectedContacts: string[];
  selectedIds: string[]; // Added missing property
  currentPage: number; // Added missing property
  totalPages: number; // Added missing property
  itemsPerPage: number; // Added missing property
  totalItems: number; // Added missing property
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
