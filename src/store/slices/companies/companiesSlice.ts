import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Company } from '@/types/company';
import { companiesService, CompanyParams } from '@/api/services/companiesService';

interface CompaniesState {
  companies: Company[];
  companyDetails: Company | null;
  selectedCompanies: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CompaniesState = {
  companies: [],
  companyDetails: null,
  selectedCompanies: [],
  loading: false,
  error: null,
};

// 🔄 Fetch Companies
export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await companiesService.fetchCompanies();
      console.log(response, 'response');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔄 Create Company
export const createCompany = createAsyncThunk(
  'companies/createCompany',
  async (company: Partial<Company>, { rejectWithValue }) => {
    try {
      const response = await companiesService.createCompany(company);
      return response.data.companyList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔄 Update Company
export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async ({ id, company }: { id: string; company: Partial<Company> }, { rejectWithValue }) => {
    try {
      const response = await companiesService.updateCompany(id, company);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔄 Delete Company
export const deleteCompany = createAsyncThunk(
  'companies/deleteCompany',
  async (id: string, { rejectWithValue }) => {
    try {
      await companiesService.deleteCompany(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔄 Get Company
export const getCompany = createAsyncThunk(
  'companies/getCompany',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await companiesService.getCompany(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setSelectedCompanies: (state, action: PayloadAction<string[]>) => {
      state.selectedCompanies = action.payload;
    },
    toggleCompanySelection: (state, action: PayloadAction<string>) => {
      const companyId = action.payload;
      const index = state.selectedCompanies.indexOf(companyId);
      if (index === -1) {
        state.selectedCompanies.push(companyId);
      } else {
        state.selectedCompanies.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Companies
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
      // Create Company
      .addCase(createCompany.fulfilled, (state, action) => {
        state.companies = action.payload;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Update Company
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.companyDetails = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete Company
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(company => company.id !== action.payload);
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Get Company
      .addCase(getCompany.fulfilled, (state, action) => {
        state.companyDetails = action.payload;
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.error = action.payload as string;
      })
  },
});

export const { setSelectedCompanies, toggleCompanySelection } = companiesSlice.actions;
export default companiesSlice.reducer;