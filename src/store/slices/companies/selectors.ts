
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';

// Base selector
const getCompaniesState = (state: RootState) => state.companies;

// Memoized selectors
export const selectAllCompanies = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.companies
);

export const selectSelectedCompanyIds = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.selectedCompanyIds
);

export const selectCompanyDetails = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.companyDetails
);

export const selectCompaniesLoading = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.loading
);

export const selectCompaniesError = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.error
);

export const selectSelectedCompany = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.selectedCompany
);
