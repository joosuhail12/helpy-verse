
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import type { Company } from '@/types/company';

// Base selector
const getCompaniesState = (state: RootState) => state.companies;

// Memoized selectors for normalized state
export const selectCompanyIds = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.ids
);

export const selectCompanyEntities = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.entities
);

export const selectAllCompanies = createSelector(
  [selectCompanyIds, selectCompanyEntities],
  (ids, entities) => ids.map(id => entities[id]).filter(Boolean) as Company[]
);

// For backwards compatibility
export const selectCompanies = selectAllCompanies;

export const selectCompaniesLoading = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.loading
);

// For backwards compatibility
export const selectCompanyLoading = selectCompaniesLoading;

export const selectCompaniesError = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.error
);

// For backwards compatibility
export const selectCompanyError = selectCompaniesError;

export const selectCompanyDetails = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.companyDetails
);

export const selectSelectedCompanyId = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.selectedCompanyId
);

export const selectSelectedCompany = createSelector(
  [selectCompanyEntities, selectSelectedCompanyId],
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

export const selectSelectedCompanyIds = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.selectedCompanyIds
);

export const selectSelectedCompanies = createSelector(
  [selectCompanyEntities, selectSelectedCompanyIds],
  (entities, selectedIds) => selectedIds.map(id => entities[id]).filter(Boolean) as Company[]
);

export const selectLastFetchTime = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.lastFetchTime
);

// Parameterized selectors
export const selectCompanyById = createSelector(
  [selectCompanyEntities, (_, companyId: string) => companyId],
  (entities, companyId) => entities[companyId] || null
);

export const selectCompaniesByIds = createSelector(
  [selectCompanyEntities, (_, companyIds: string[]) => companyIds],
  (entities, companyIds) => companyIds.map(id => entities[id]).filter(Boolean) as Company[]
);
