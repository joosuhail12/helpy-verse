
import type { Contact, ContactFilters } from '@/types/contact';

// Define the state types
export interface ContactsState {
  contacts: Contact[];
  selectedContact: Contact | null;
  selectedContactIds: string[];
  contactDetails: Contact | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  filters: ContactFilters;
  lastFetchTime: number | null;
}

export interface UpdateContactPayload {
  contactId: string;
  data: Partial<Contact>;
}
