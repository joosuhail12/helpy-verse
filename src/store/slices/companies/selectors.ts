
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

export const selectCompanies = createSelector(
  [selectCompanyIds, selectCompanyEntities],
  (ids, entities) => ids.map(id => entities[id])
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

export const selectSelectedCompanyId = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.selectedCompanyId
);

export const selectSelectedCompany = createSelector(
  [selectCompanyEntities, selectSelectedCompanyId],
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

export const selectSelectedCompanies = createSelector(
  [getCompaniesState],
  (companiesState) => companiesState.selectedCompanyIds
);

export const selectSelectedCompanyEntities = createSelector(
  [selectCompanyEntities, selectSelectedCompanies],
  (entities, selectedIds) => selectedIds.map(id => entities[id]).filter(Boolean)
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
  (entities, companyIds) => companyIds.map(id => entities[id]).filter(Boolean)
);
