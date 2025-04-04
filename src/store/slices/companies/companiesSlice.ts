
import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { companiesService } from '@/api/services/companiesService';
import { Company } from '@/types/company';

export interface CompaniesState {
  companies: Company[];
  selectedCompany: string | null;
  loading: boolean;
  error: string | null;
  companyDetails: Company | null;
  selectedCompanies: string[];
  lastFetchTime: number | null;
}

const initialState: CompaniesState = {
  companies: [],
  selectedCompany: null,
  loading: false,
  error: null,
  companyDetails: null,
  selectedCompanies: [],
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
      state.selectedCompany = action.payload;
    },
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
    },
    toggleCompanySelection: (state, action: PayloadAction<string>) => {
      const companyId = action.payload;
      if (state.selectedCompanies.includes(companyId)) {
        state.selectedCompanies = state.selectedCompanies.filter(id => id !== companyId);
      } else {
        state.selectedCompanies.push(companyId);
      }
    },
    clearSelectedCompanies: (state) => {
      state.selectedCompanies = [];
    },
    setSelectedCompanies: (state, action: PayloadAction<string[]>) => {
      state.selectedCompanies = action.payload;
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
          state.companies = action.payload;
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
        state.companies.push(action.payload);
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
        const index = state.companies.findIndex(company => company.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
        if (state.companyDetails?.id === action.payload.id) {
          state.companyDetails = action.payload;
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
        state.companies = state.companies.filter(company => company.id !== action.payload);
        if (state.companyDetails?.id === action.payload) {
          state.companyDetails = null;
        }
        state.selectedCompanies = state.selectedCompanies.filter(id => id !== action.payload);
        if (state.selectedCompany === action.payload) {
          state.selectedCompany = null;
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

// Base selector
const getCompaniesState = (state: RootState) => state.companies;

// Memoized selectors using createSelector
export const selectCompanies = createSelector(
  [getCompaniesState],
  (state) => state.companies
);

export const selectCompanyLoading = createSelector(
  [getCompaniesState],
  (state) => state.loading
);

export const selectCompanyError = createSelector(
  [getCompaniesState],
  (state) => state.error
);

export const selectCompanyDetails = createSelector(
  [getCompaniesState],
  (state) => state.companyDetails
);

export const selectSelectedCompany = createSelector(
  [getCompaniesState],
  (state) => state.selectedCompany
);

export const selectSelectedCompanies = createSelector(
  [getCompaniesState],
  (state) => state.selectedCompanies
);

export const selectCompanyById = createSelector(
  [selectCompanies, (_, companyId: string) => companyId],
  (companies, companyId) => companies.find(company => company.id === companyId) || null
);

export const selectCompaniesByIds = createSelector(
  [selectCompanies, (_, companyIds: string[]) => companyIds],
  (companies, companyIds) => companies.filter(company => companyIds.includes(company.id))
);

export default companiesSlice.reducer;
