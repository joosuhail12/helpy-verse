
import { Contact } from '@/types/contact';

export interface ContactsState {
  entities: Record<string, Contact>;
  ids: string[];
  contactDetails: Contact | null;
  selectedContactId: Contact | null;
  selectedContactIds: string[];
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

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
