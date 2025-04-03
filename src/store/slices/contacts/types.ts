
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export interface ContactsState {
  contacts: any[];
  contactDetails: any | null;
  selectedContact: string | null;
  selectedContacts: string[];
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
}
