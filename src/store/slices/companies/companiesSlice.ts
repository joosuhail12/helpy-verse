
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Company } from '@/types/company';

interface CompaniesState {
  companies: Company[];
  selectedCompanies: string[];
  loading: boolean;
  error: string | null;
}

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    website: 'https://www.acme.com',
    industry: 'Technology',
    employeeCount: 500,
    type: 'customer',
    status: 'active',
    description: 'Leading technology solutions provider',
    phone: '+1 (555) 123-4567',
    email: 'contact@acme.com',
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA'
    },
    createdAt: new Date(2024, 0, 15).toISOString(),
    updatedAt: new Date(2024, 0, 15).toISOString(),
  },
  {
    id: '2',
    name: 'TechSpace Solutions',
    website: 'https://www.techspace.io',
    createdAt: new Date(2024, 1, 1).toISOString(),
    updatedAt: new Date(2024, 1, 1).toISOString(),
  },
  {
    id: '3',
    name: 'Global Innovations Inc',
    website: 'https://www.globalinnovations.com',
    createdAt: new Date(2024, 1, 15).toISOString(),
    updatedAt: new Date(2024, 1, 15).toISOString(),
  },
  {
    id: '4',
    name: 'Future Systems',
    website: 'https://www.futuresystems.co',
    createdAt: new Date(2024, 2, 1).toISOString(),
    updatedAt: new Date(2024, 2, 1).toISOString(),
  },
  {
    id: '5',
    name: 'Digital Dynamics',
    website: 'https://www.digitaldynamics.tech',
    createdAt: new Date(2024, 2, 15).toISOString(),
    updatedAt: new Date(2024, 2, 15).toISOString(),
  },
];

const initialState: CompaniesState = {
  companies: mockCompanies,
  selectedCompanies: [],
  loading: false,
  error: null,
};

export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async () => {
    // In a real app, this would be an API call
    return mockCompanies;
  }
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    addCompany: (state, action: PayloadAction<Company>) => {
      state.companies.push(action.payload);
    },
    updateCompany: (state, action: PayloadAction<Partial<Company> & { id: string }>) => {
      const index = state.companies.findIndex(company => company.id === action.payload.id);
      if (index !== -1) {
        state.companies[index] = { ...state.companies[index], ...action.payload };
      }
    },
    deleteCompany: (state, action: PayloadAction<string>) => {
      state.companies = state.companies.filter(company => company.id !== action.payload);
    },
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
        state.error = action.error.message || 'Failed to fetch companies';
      });
  },
});

export const {
  addCompany,
  updateCompany,
  deleteCompany,
  setSelectedCompanies,
  toggleCompanySelection,
} = companiesSlice.actions;

export default companiesSlice.reducer;

