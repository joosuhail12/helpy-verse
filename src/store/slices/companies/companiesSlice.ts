
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Company } from '@/types/company';

interface CompaniesState {
  companies: Company[];
  selectedCompanies: string[];
}

const initialState: CompaniesState = {
  companies: [],
  selectedCompanies: [],
};

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
  },
});

export const { addCompany, updateCompany, deleteCompany, setSelectedCompanies } = companiesSlice.actions;
export default companiesSlice.reducer;
