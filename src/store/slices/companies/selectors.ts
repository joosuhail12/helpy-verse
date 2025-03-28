
import { RootState } from '@/store/store';

export const selectSelectedCompanyIds = (state: RootState) => 
  state.companies.selectedCompanyIds;
