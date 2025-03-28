
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { 
  selectCompanyDetails, 
  selectCompaniesLoading, 
  selectCompaniesError,
  fetchCompanyById
} from '@/store/slices/companies/companiesSlice';

export const useCompanyDetails = (companyId?: string) => {
  const dispatch = useAppDispatch();
  const companyDetails = useAppSelector(selectCompanyDetails);
  const loading = useAppSelector(selectCompaniesLoading);
  const error = useAppSelector(selectCompaniesError);

  const loadCompanyDetails = (id: string) => {
    dispatch(fetchCompanyById(id));
  };

  return {
    companyDetails,
    loading,
    error,
    loadCompanyDetails
  };
};
