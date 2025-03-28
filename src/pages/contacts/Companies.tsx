
// src/pages/contacts/Companies.tsx
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCompanies } from '@/store/slices/companies/companiesSlice';
import { 
  selectCompanies, 
  selectCompanyLoading, 
  selectCompanyError 
} from '@/store/slices/companies/selectors';
import { CompaniesList } from '@/components/companies/CompaniesList';
import { CompaniesHeader } from '@/components/companies/CompaniesHeader';
import { CompaniesListControls } from '@/components/companies/CompaniesListControls';
import { Card } from '@/components/ui/card';

const Companies = () => {
  const dispatch = useAppDispatch();
  const companies = useAppSelector(selectCompanies);
  const loading = useAppSelector(selectCompanyLoading);
  const error = useAppSelector(selectCompanyError);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-4 text-red-500">
          Error loading companies: {error}
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <CompaniesHeader />
      <CompaniesListControls />
      <CompaniesList companies={companies} loading={loading} />
    </div>
  );
};

export default Companies;
