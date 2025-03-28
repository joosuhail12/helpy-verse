
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Company } from '@/types/company';
import { companiesService } from '@/api/services/companiesService';
import * as selectors from './selectors';

export interface CompaniesState {
  companies: Company[];
  selectedCompanyIds: string[];
  selectedCompany: Company | null;
  loading: boolean;
  error: string | null;
  companyDetails: Company | null;
}

export interface CompanyParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CompaniesResponse {
  companies: Company[];
  total: number;
}

export interface CompanyResponse {
  id: string;
  name: string;
  [key: string]: any;
}

export interface CreateCompaniesResponse {
  id: string;
  name: string;
  [key: string]: any;
}

export interface UpdateCompanyPayload {
  id: string;
  [key: string]: any;
}

const initialState: CompaniesState = {
  companies: [],
  selectedCompanyIds: [],
  selectedCompany: null,
  loading: false,
  error: null,
  companyDetails: null,
};

export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (params?: CompanyParams) => {
    const response = await companiesService.fetchCompanies(params);
    return response;
  }
);

export const fetchCompanyById = createAsyncThunk(
  'companies/fetchCompanyById',
  async (id: string) => {
    const response = await companiesService.getCompany(id);
    return response;
  }
);

export const createCompany = createAsyncThunk(
  'companies/createCompany',
  async (company: Partial<Company>) => {
    const response = await companiesService.createCompany(company);
    return response;
  }
);

export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async ({ companyId, data }: { companyId: string; data: Partial<Company> }) => {
    const response = await companiesService.updateCompany(companyId, data);
    return response;
  }
);

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
    clearSelectedCompanies: (state) => {
      state.selectedCompanyIds = [];
    },
    toggleCompanySelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedCompanyIds.indexOf(id);
      if (index === -1) {
        state.selectedCompanyIds.push(id);
      } else {
        state.selectedCompanyIds.splice(index, 1);
      }
    },
    setSelectedCompanyIds: (state, action: PayloadAction<string[]>) => {
      state.selectedCompanyIds = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.companies;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch companies';
      })
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.companyDetails = action.payload as unknown as Company;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch company details';
      })
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        // Cast the response to Company to satisfy TypeScript
        const newCompany = action.payload as unknown as Company;
        state.companies.push(newCompany);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create company';
      })
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        // Cast the response to Company to satisfy TypeScript
        const updatedCompany = action.payload as unknown as Company;
        const index = state.companies.findIndex(company => company.id === updatedCompany.id);
        if (index !== -1) {
          state.companies[index] = updatedCompany;
        }
        if (state.companyDetails && state.companyDetails.id === updatedCompany.id) {
          state.companyDetails = updatedCompany;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update company';
      })
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(company => company.id !== action.payload);
        if (state.companyDetails && state.companyDetails.id === action.payload) {
          state.companyDetails = null;
        }
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete company';
      });
  },
});

export const { 
  setSelectedCompany, 
  clearSelectedCompanies, 
  toggleCompanySelection,
  setSelectedCompanyIds
} = companiesSlice.actions;

// Re-export selectors
export {
  selectors
};

// Export individual selectors for direct imports
export const {
  selectAllCompanies,
  selectSelectedCompanyIds,
  selectCompanyDetails,
  selectCompaniesLoading,
  selectCompaniesError,
  selectSelectedCompany
} = selectors;

export default companiesSlice.reducer;
