
import { Contact } from '@/types/contact';

export interface ContactsState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  selectedContacts: string[];
  lastFetchTime: number | null;
}

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
