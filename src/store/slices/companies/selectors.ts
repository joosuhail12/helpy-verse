
import { RootState } from '@/store/store';
import type { Company } from '@/types/company';

// Basic selectors
export const selectCompaniesState = (state: RootState) => state.companies;
export const selectAllCompanies = (state: RootState) => state.companies.companies;
export const selectCompaniesLoading = (state: RootState) => state.companies.loading;
export const selectCompaniesError = (state: RootState) => state.companies.error;
export const selectCurrentPage = (state: RootState) => state.companies.currentPage;
export const selectTotalPages = (state: RootState) => state.companies.totalPages;
export const selectSelectedCompanyIds = (state: RootState) => state.companies.selectedCompanyIds;
export const selectSelectedCompany = (state: RootState) => state.companies.selectedCompany;

// Derived selectors
export const selectCompanyById = (state: RootState, id: string) => {
  return state.companies.companies.find(company => company.id === id);
};

export const selectCompaniesByIndustry = (state: RootState, industry: string) => {
  return state.companies.companies.filter(company => company.industry === industry);
};

export const selectSelectedCompanies = (state: RootState) => {
  const selectedIds = selectSelectedCompanyIds(state);
  return state.companies.companies.filter(company => selectedIds.includes(company.id));
};
