
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCompanies } from '@/store/slices/companies/companiesSlice';
import { CompaniesList } from '@/components/companies/CompaniesList';
import { CompaniesHeader } from '@/components/companies/CompaniesHeader';
import { CompaniesListControls } from '@/components/companies/CompaniesListControls';

const Companies = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        await dispatch(fetchCompanies({
          page: 1,
          limit: 20
        }));
      } catch (error) {
        console.error('Failed to load companies:', error);
      }
    };

    loadCompanies();
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <CompaniesHeader />
      <CompaniesListControls />
      <CompaniesList />
    </div>
  );
};

export default Companies;
