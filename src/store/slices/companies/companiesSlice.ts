
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { companiesService } from '@/api/services/companiesService';
import { Company } from '@/types/company';

export interface CompaniesState {
  entities: Record<string, Company>;
  ids: string[];
  selectedCompanyId: string | null;
  loading: boolean;
  error: string | null;
  companyDetails: Company | null;
  selectedCompanyIds: string[];
  lastFetchTime: number | null;
}

const initialState: CompaniesState = {
  entities: {},
  ids: [],
  selectedCompanyId: null,
  loading: false,
  error: null,
  companyDetails: null,
  selectedCompanyIds: [],
  lastFetchTime: null
};

// Cache duration in milliseconds (5 minutes)
export const CACHE_DURATION = 5 * 60 * 1000;

export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (_, { getState, rejectWithValue }) => {
    try {
      console.log('Fetching companies');
      const state = getState() as RootState;
      const { lastFetchTime } = state.companies;
      
      // Use cache if data is fresh
      if (lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
        console.log('Using cached companies data');
        return null;
      }

      const response = await companiesService.fetchCompanies();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch companies');
    }
  }
);

export const fetchCompanyById = createAsyncThunk(
  'companies/fetchCompanyById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await companiesService.getCompany(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch company details');
    }
  }
);

export const createCompany = createAsyncThunk(
  'companies/createCompany',
  async (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await companiesService.createCompany(company);
      return response.data.companyList[0];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create company');
    }
  }
);

export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async ({ id, updates }: { id: string; updates: Partial<Company> }, { rejectWithValue }) => {
    try {
      const response = await companiesService.updateCompany(id, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update company');
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'companies/deleteCompany',
  async (id: string, { rejectWithValue }) => {
    try {
      await companiesService.deleteCompany(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete company');
    }
  }
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    selectCompany: (state, action: PayloadAction<string>) => {
      state.selectedCompanyId = action.payload;
    },
    clearSelectedCompany: (state) => {
      state.selectedCompanyId = null;
    },
    toggleCompanySelection: (state, action: PayloadAction<string>) => {
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
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) { // Only update if we got new data (not using cache)
          // Normalize the companies data
          const entities: Record<string, Company> = {};
          const ids: string[] = [];
          
          action.payload.forEach((company: Company) => {
            entities[company.id] = company;
            ids.push(company.id);
          });
          
          state.entities = entities;
          state.ids = ids;
          state.lastFetchTime = Date.now();
        }
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.companyDetails = action.payload;
        
        // Also update the company in the entities if it exists
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
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        // Add to normalized store
        const company = action.payload;
        state.entities[company.id] = company;
        if (!state.ids.includes(company.id)) {
          state.ids.push(company.id);
        }
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCompany = action.payload;
        
        // Update in normalized store
        if (updatedCompany) {
          state.entities[updatedCompany.id] = updatedCompany;
          
          // Update company details if it's the currently viewed company
          if (state.companyDetails?.id === updatedCompany.id) {
            state.companyDetails = updatedCompany;
          }
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        
        // Remove from normalized store
        delete state.entities[deletedId];
        state.ids = state.ids.filter(id => id !== deletedId);
        
        // Clean up references
        if (state.companyDetails?.id === deletedId) {
          state.companyDetails = null;
        }
        
        state.selectedCompanyIds = state.selectedCompanyIds.filter(id => id !== deletedId);
        
        if (state.selectedCompanyId === deletedId) {
          state.selectedCompanyId = null;
        }
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export action creators
export const { 
  selectCompany, 
  clearSelectedCompany, 
  toggleCompanySelection, 
  clearSelectedCompanies, 
  setSelectedCompanies 
} = companiesSlice.actions;

// Export the reducer
export default companiesSlice.reducer;
