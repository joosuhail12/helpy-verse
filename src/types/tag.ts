
export interface TagCount {
  tickets: number;
  contacts: number;
  companies: number;
}

export interface TagHistoryItem {
  date: string;
  count: number;
  total?: number; // Adding total field that was being used
}

export interface TagPreviewItem {
  id: string;
  name: string;
  type: 'ticket' | 'contact' | 'company';
  title?: string; // Adding title field that was being used
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  lastUsed: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  counts: TagCount;
  history: TagHistoryItem[];
  preview: TagPreviewItem[];
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
