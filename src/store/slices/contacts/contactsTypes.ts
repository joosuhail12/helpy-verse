
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
  id: string;
  updates: Partial<Contact>;
}

// Define cache duration for data fetching
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
