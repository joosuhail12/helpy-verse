import { HttpClient } from "@/api/services/http";
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { companiesService } from '@/api/services/companiesService';
import { Company as CompanyType } from '@/types/company';

export type Company = CompanyType;

const API_ENDPOINTS = {
  COMPANIES: '/company',
  COMPANY_BY_ID: (id: string) => `/company/${id}`
};

export interface CompaniesState {
  companies: Company[];
  selectedCompany: string | null;
  loading: boolean;
  error: string | null;
  companyDetails: Company | null;
  selectedCompanies: string[];
}

const initialState: CompaniesState = {
  companies: [],
  selectedCompany: null,
  loading: false,
  error: null,
  companyDetails: null,
  selectedCompanies: []
};

export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching companies');
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
        state.companies = action.payload;
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
      .addCase(createCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload);
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(company => company.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
        if (state.companyDetails?.id === action.payload.id) {
          state.companyDetails = action.payload;
        }
      });
  },
});

export const { 
  selectCompany, 
  clearSelectedCompany, 
  toggleCompanySelection, 
  clearSelectedCompanies, 
  setSelectedCompanies 
} = companiesSlice.actions;

export const selectCompanies = (state: RootState) => state.companies.companies;
export const selectCompanyLoading = (state: RootState) => state.companies.loading;
export const selectCompanyError = (state: RootState) => state.companies.error;
export const selectCompanyDetails = (state: RootState) => state.companies.companyDetails;
export const selectSelectedCompany = (state: RootState) => state.companies.selectedCompany;
export const selectSelectedCompanies = (state: RootState) => state.companies.selectedCompanies;

export default companiesSlice.reducer;
