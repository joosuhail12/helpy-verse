
export interface ContactsState {
  contacts: any[];
  contactDetails: any | null;
  selectedContact: string | null;
  selectedContacts: string[];
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
}
