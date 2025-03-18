
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  size: string;
  location: string;
  description: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  contactIds: string[];
}

export interface CompaniesState {
  items: Company[];
  selectedCompany: Company | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompaniesState = {
  items: [],
  selectedCompany: null,
  loading: false,
  error: null,
};

export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/companies');
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCompanyById = createAsyncThunk(
  'companies/fetchCompanyById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/companies/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch company');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCompany = createAsyncThunk(
  'companies/createCompany',
  async (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company),
      });
      if (!response.ok) {
        throw new Error('Failed to create company');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async ({ id, updates }: { id: string; updates: Partial<Company> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update company');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'companies/deleteCompany',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete company');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    selectCompany: (state, action: PayloadAction<Company>) => {
      state.selectedCompany = action.payload;
    },
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
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
        state.selectedCompany = action.payload;
        state.loading = false;
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
        state.items.push(action.payload);
        state.selectedCompany = action.payload;
        state.loading = false;
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
        const index = state.items.findIndex(
          (company) => company.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedCompany?.id === action.payload.id) {
          state.selectedCompany = action.payload;
        }
        state.loading = false;
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
        state.items = state.items.filter(
          (company) => company.id !== action.payload
        );
        if (state.selectedCompany?.id === action.payload) {
          state.selectedCompany = null;
        }
        state.loading = false;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectCompany, clearSelectedCompany } = companiesSlice.actions;

// Selectors
export const selectCompanies = (state: RootState) => state.companies.items;
export const selectSelectedCompany = (state: RootState) => state.companies.selectedCompany;
export const selectCompaniesLoading = (state: RootState) => state.companies.loading;
export const selectCompaniesError = (state: RootState) => state.companies.error;

export default companiesSlice.reducer;
