
export interface Tag {
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
  data?: any; // Add this property to match what's expected by the API
}

export type SortField = 'name' | 'tickets' | 'contacts' | 'companies' | 'lastUsed' | 'createdAt';
export type FilterEntity = 'all' | 'tickets' | 'contacts' | 'companies';
