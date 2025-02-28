
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define company state type
interface CompanyState {
  companies: any[];
  companyDetails: any | null;
  selectedCompany: any | null;
  selectedCompanies: string[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CompanyState = {
  companies: [],
  companyDetails: null,
  selectedCompany: null,
  selectedCompanies: [],
  loading: false,
  error: null,
};

// Create the company slice
const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setSelectedCompanies: (state, action) => {
      state.selectedCompanies = action.payload;
    },
    clearSelectedCompanies: (state) => {
      state.selectedCompanies = [];
    },
  },
  extraReducers: (builder) => {
    // Add extra reducers as needed
  },
});

// Export actions and reducer
export const { setSelectedCompanies, clearSelectedCompanies } = companySlice.actions;

// Selectors
export const selectCompanies = (state: RootState) => state.companies?.companies ?? [];
export const selectCompanyLoading = (state: RootState) => state.companies?.loading ?? false;
export const selectCompanyError = (state: RootState) => state.companies?.error ?? null;
export const selectCompanyDetails = (state: RootState) => state.companies?.companyDetails ?? null;
export const selectSelectedCompany = (state: RootState) => state.companies?.selectedCompany ?? null;
export const selectSelectedCompanies = (state: RootState) => state.companies?.selectedCompanies ?? [];

export default companySlice.reducer;
