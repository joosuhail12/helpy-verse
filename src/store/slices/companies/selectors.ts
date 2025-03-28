
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import type { Company } from '@/types/company';

// Base selector
const getCompaniesState = (state: RootState) => state.companies;

// Memoized selectors
export const selectCompanies = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.companies
);

export const selectCompanyLoading = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.loading
);

export const selectCompanyError = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.error
);

export const selectCompanyDetails = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.companyDetails
);

export const selectSelectedCompany = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.selectedCompany
);

export const selectSelectedCompanies = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.selectedCompanies
);

export const selectLastFetchTime = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.lastFetchTime
);

// Parameterized selectors
export const selectCompanyById = createSelector(
  [selectCompanies, (_, companyId: string) => companyId],
  (companies, companyId) => companies.find(company => company.id === companyId) || null
);

export const selectCompaniesByIds = createSelector(
  [selectCompanies, (_, companyIds: string[]) => companyIds],
  (companies, companyIds) => companies.filter(company => companyIds.includes(company.id))
);
