
import companiesReducer from './companiesSlice';
import * as companiesActions from './companiesSlice';
import * as companiesSelectors from './selectors';

export { companiesReducer, companiesActions, companiesSelectors };

// Re-export specific types and actions for convenience
export type { CompaniesState, CompanyParams } from './companiesSlice';

// Re-export actions
export {
  fetchCompanies,
  fetchCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  setSelectedCompany,
  clearSelectedCompanies,
  toggleCompanySelection,
  setSelectedCompanyIds
} from './companiesSlice';

// Re-export selectors
export {
  selectAllCompanies,
  selectSelectedCompanyIds,
  selectCompanyDetails,
  selectCompaniesLoading,
  selectCompaniesError,
  selectSelectedCompany
} from './selectors';

export default companiesReducer;
