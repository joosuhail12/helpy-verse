
export interface TagCount {
  tickets: number;
  contacts: number;
  companies: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  lastUsed: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  counts: TagCount;
  history: Array<{
    date: string;
    count: number;
  }>;
  preview: Array<{
    id: string;
    name: string;
    type: 'ticket' | 'contact' | 'company';
  }>;
  data?: any;
}

export type SortField = 
  | 'name'
  | 'createdAt'
  | 'lastUsed'
  | 'usage';

export type FilterEntity = 
  | 'all'
  | 'tickets'
  | 'contacts'
  | 'companies';

export interface TagsState {
  tags: Tag[];
  items: Tag[];
  total: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  filterEntity: FilterEntity | null;
  searchQuery: string;
  selectedTags: string[];
}
