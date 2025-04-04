
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCompanyById } from '@/store/slices/companies/companiesSlice';
import { selectCompanyDetails, selectCompaniesLoading, selectCompaniesError } from '@/store/slices/companies/selectors';
import { CompanyDetailHeader } from '@/components/companies/detail/CompanyDetailHeader';
import { CompanyDetailContent } from '@/components/companies/detail/CompanyDetailContent';
import { CompanyDetailSidebar } from '@/components/companies/detail/CompanyDetailSidebar';
import { CompanyDetailLoading } from '@/components/companies/detail/CompanyDetailLoading';
import { CompanyDetailError } from '@/components/companies/detail/CompanyDetailError';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const company = useAppSelector(selectCompanyDetails);
  const loading = useAppSelector(selectCompaniesLoading);
  const error = useAppSelector(selectCompaniesError);

  useEffect(() => {
    if (id) {
      dispatch(fetchCompanyById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <CompanyDetailLoading />;
  }

  if (error) {
    return <CompanyDetailError error={error} />;
  }

  if (!company) {
    return <div className="text-center py-8">Company not found</div>;
  }

  // Mock activities for now
  const activities = [];

  return (
    <div className="flex flex-col space-y-6">
      <CompanyDetailHeader 
        company={company} 
        onDeleteClick={() => console.log('Delete clicked')} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CompanyDetailContent company={company} activities={activities} />
        </div>
        <div className="lg:col-span-1">
          <CompanyDetailSidebar company={company} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
