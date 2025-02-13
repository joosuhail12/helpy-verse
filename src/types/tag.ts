
export interface Tag {
  id: string;
  name: string;
  color: string;
  counts: {
    tickets: number;
    contacts: number;
    companies: number;
  };
}

export type SortField = 'name' | 'tickets' | 'contacts' | 'companies';
export type FilterEntity = 'all' | 'tickets' | 'contacts' | 'companies';
