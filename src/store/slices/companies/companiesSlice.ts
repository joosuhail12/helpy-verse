
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company } from '@/types/company';
import { RootState } from '@/store/store';
import { companiesService } from '@/api/services/companiesService';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Types for the companies state
interface CompaniesState {
  entities: Record<string, Company>;
  ids: string[];
  loading: boolean;
  error: string | null;
  companyDetails: Company | null;
  selectedCompanyId: string | null;
  selectedCompanyIds: string[];
  lastFetchTime: number | null;
}

// Initial state
const initialState: CompaniesState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
  companyDetails: null,
  selectedCompanyId: null,
  selectedCompanyIds: [],
  lastFetchTime: null,
};

// Async thunks
export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await companiesService.fetchCompanies();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch companies');
    }
  }
);

export const fetchCompanyById = createAsyncThunk(
  'companies/fetchCompanyById',
  async (companyId: string, { rejectWithValue }) => {
    try {
      const response = await companiesService.getCompanyById(companyId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch company details');
    }
  }
);

export const createCompany = createAsyncThunk(
  'companies/createCompany',
  async (companyData: Partial<Company>, { rejectWithValue }) => {
    try {
      const response = await companiesService.createCompany(companyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create company');
    }
  }
);

export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async ({ companyId, data }: { companyId: string; data: Partial<Company> }, { rejectWithValue }) => {
    try {
      const response = await companiesService.updateCompany(companyId, data);
      return { companyId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update company');
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'companies/deleteCompany',
  async (companyId: string, { rejectWithValue }) => {
    try {
      await companiesService.deleteCompany(companyId);
      return companyId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete company');
    }
  }
);

// Create the companies slice
const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    selectCompany: (state, action: PayloadAction<string>) => {
      state.selectedCompanyId = action.payload;
    },
    toggleSelectCompany: (state, action: PayloadAction<string>) => {
      const companyId = action.payload;
      if (state.selectedCompanyIds.includes(companyId)) {
        state.selectedCompanyIds = state.selectedCompanyIds.filter(id => id !== companyId);
      } else {
        state.selectedCompanyIds.push(companyId);
      }
    },
    clearSelectedCompanies: (state) => {
      state.selectedCompanyIds = [];
    },
    setSelectedCompanies: (state, action: PayloadAction<string[]>) => {
      state.selectedCompanyIds = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCompanies action states
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        
        // Normalize companies data
        const entities: Record<string, Company> = {};
        const ids: string[] = [];
        
        action.payload.forEach((company: Company) => {
          entities[company.id] = company;
          ids.push(company.id);
        });
        
        state.entities = entities;
        state.ids = ids;
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle fetchCompanyById action states
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.companyDetails = action.payload;
        
        // Also update the company in the entities
        if (action.payload) {
          state.entities[action.payload.id] = action.payload;
          if (!state.ids.includes(action.payload.id)) {
            state.ids.push(action.payload.id);
          }
        }
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle createCompany action states
      .addCase(createCompany.fulfilled, (state, action) => {
        const newCompany = action.payload;
        state.entities[newCompany.id] = newCompany;
        if (!state.ids.includes(newCompany.id)) {
          state.ids.push(newCompany.id);
        }
      })
      
      // Handle updateCompany action states
      .addCase(updateCompany.fulfilled, (state, action) => {
        if (action.payload) {
          const { companyId, data } = action.payload;
          state.entities[companyId] = { ...state.entities[companyId], ...data };
          
          if (state.companyDetails && state.companyDetails.id === companyId) {
            state.companyDetails = { ...state.companyDetails, ...data };
          }
        }
      })
      
      // Handle deleteCompany action states
      .addCase(deleteCompany.fulfilled, (state, action) => {
        const companyId = action.payload;
        delete state.entities[companyId];
        state.ids = state.ids.filter(id => id !== companyId);
        
        if (state.companyDetails && state.companyDetails.id === companyId) {
          state.companyDetails = null;
        }
        
        state.selectedCompanyIds = state.selectedCompanyIds.filter(id => id !== companyId);
        
        if (state.selectedCompanyId === companyId) {
          state.selectedCompanyId = null;
        }
      });
  },
});

// Export actions
export const { 
  selectCompany, 
  toggleSelectCompany, 
  clearSelectedCompanies,
  setSelectedCompanies
} = companiesSlice.actions;

// Export selectors directly from this slice (these should be deprecated in favor of selectors.ts)
export const selectAllCompanies = (state: RootState) => 
  state.companies.ids.map(id => state.companies.entities[id]);

export const selectCompanyDetails = (state: RootState) => state.companies.companyDetails;
export const selectCompaniesLoading = (state: RootState) => state.companies.loading;
export const selectCompaniesError = (state: RootState) => state.companies.error;

// Export the reducer as default
export default companiesSlice.reducer;
