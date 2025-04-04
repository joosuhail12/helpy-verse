
export interface Tag {
  data: any;
  id: string;
  name: string;
  color: string;
  createdAt: string;
  lastUsed: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  counts: {
    tickets: number;
    contacts: number;
    companies: number;
  };
  history: {
    date: string;
    total: number;
  }[];
  preview?: {
    type: 'ticket' | 'contact' | 'company';
    id: string;
    title: string;
  }[];
}

export type SortField = 'name' | 'tickets' | 'contacts' | 'companies' | 'lastUsed' | 'createdAt';
export type FilterEntity = 'all' | 'tickets' | 'contacts' | 'companies';

