
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Company } from '@/types/company';
import { companiesService } from '@/api/services/companiesService';

export interface CompaniesState {
  companies: Company[];
  selectedCompany: Company | null;
  selectedCompanyIds: string[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  total: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  filterOptions: Record<string, string>;
}

const initialState: CompaniesState = {
  companies: [],
  selectedCompany: null,
  selectedCompanyIds: [],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1,
  total: 0,
  sortField: 'name',
  sortDirection: 'asc',
  filterOptions: {}
};

// Fetch companies
export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (params?: any) => {
    const response = await companiesService.fetchCompanies(params);
    return response;
  }
);

// Fetch company by ID
export const fetchCompanyById = createAsyncThunk(
  'companies/fetchCompanyById',
  async (id: string) => {
    const response = await companiesService.getCompany(id);
    return response;
  }
);

// Create a new company
export const createCompany = createAsyncThunk(
  'companies/createCompany',
  async (company: Partial<Company>) => {
    const response = await companiesService.createCompany(company);
    return response;
  }
);

// Update an existing company
export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async ({ companyId, data }: { companyId: string; data: Partial<Company> }) => {
    const response = await companiesService.updateCompany(companyId, data);
    return response;
  }
);

// Delete a company
export const deleteCompany = createAsyncThunk(
  'companies/deleteCompany',
  async (id: string) => {
    await companiesService.deleteCompany(id);
    return id;
  }
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setSelectedCompany: (state, action: PayloadAction<Company | null>) => {
      state.selectedCompany = action.payload;
    },
    selectCompany: (state, action: PayloadAction<string>) => {
      if (!state.selectedCompanyIds.includes(action.payload)) {
        state.selectedCompanyIds.push(action.payload);
      }
    },
    unselectCompany: (state, action: PayloadAction<string>) => {
      state.selectedCompanyIds = state.selectedCompanyIds.filter(id => id !== action.payload);
    },
    toggleCompanySelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedCompanyIds.indexOf(action.payload);
      if (index === -1) {
        state.selectedCompanyIds.push(action.payload);
      } else {
        state.selectedCompanyIds.splice(index, 1);
      }
    },
    selectAllCompanies: (state) => {
      state.selectedCompanyIds = state.companies.map(company => company.id);
    },
    clearCompanySelection: (state) => {
      state.selectedCompanyIds = [];
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSort: (state, action: PayloadAction<{ field: string; direction: 'asc' | 'desc' }>) => {
      state.sortField = action.payload.field;
      state.sortDirection = action.payload.direction;
    },
    setFilter: (state, action: PayloadAction<Record<string, string>>) => {
      state.filterOptions = action.payload;
      state.currentPage = 1; // Reset to first page when changing filters
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.data;
        state.total = action.payload.total || action.payload.data.length;
        state.totalPages = Math.ceil(state.total / state.itemsPerPage);
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch companies';
      })

      // Fetch company by ID
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCompany = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch company';
      })

      // Create company
      .addCase(createCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload);
        state.total = state.total + 1;
        state.totalPages = Math.ceil(state.total / state.itemsPerPage);
      })

      // Update company
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(company => company.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
        if (state.selectedCompany && state.selectedCompany.id === action.payload.id) {
          state.selectedCompany = action.payload;
        }
      })

      // Delete company
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(company => company.id !== action.payload);
        if (state.selectedCompany && state.selectedCompany.id === action.payload) {
          state.selectedCompany = null;
        }
        state.selectedCompanyIds = state.selectedCompanyIds.filter(id => id !== action.payload);
        state.total = state.total - 1;
        state.totalPages = Math.ceil(state.total / state.itemsPerPage);
      });
  }
});

export const {
  setSelectedCompany,
  selectCompany,
  unselectCompany,
  toggleCompanySelection,
  selectAllCompanies,
  clearCompanySelection,
  setPage,
  setSort,
  setFilter
} = companiesSlice.actions;

export default companiesSlice.reducer;
