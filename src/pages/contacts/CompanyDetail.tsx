
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { 
  fetchCompanyById,
  setSelectedCompany
} from '@/store/slices/companies/companiesSlice';
import { selectSelectedCompany, selectCompaniesLoading, selectCompaniesError } from '@/store/slices/companies/selectors';
import { CompanyDetailHeader } from '@/components/companies/detail/CompanyDetailHeader';
import { CompanyDetailSidebar } from '@/components/companies/detail/CompanyDetailSidebar';
import { CompanyDetailContent } from '@/components/companies/detail/CompanyDetailContent';
import { CompanyDetailLoading } from '@/components/companies/detail/CompanyDetailLoading';
import { CompanyDetailError } from '@/components/companies/detail/CompanyDetailError';
import { CompanyNotFound } from '@/components/companies/detail/CompanyNotFound';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  const companyDetails = useAppSelector(selectSelectedCompany);
  const loading = useAppSelector(selectCompaniesLoading);
  const error = useAppSelector(selectCompaniesError);

  useEffect(() => {
    if (id) {
      dispatch(fetchCompanyById(id));
    }
    
    return () => {
      // Clear selected company on unmount
      dispatch(setSelectedCompany(null));
    };
  }, [dispatch, id]);

  if (loading) {
    return <CompanyDetailLoading />;
  }

  if (error) {
    return <CompanyDetailError message={error} />;
  }

  if (!companyDetails && !loading) {
    return <CompanyNotFound companyId={id || ''} />;
  }

  if (!companyDetails) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <CompanyDetailHeader company={companyDetails} onDeleteClick={() => {}} />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <CompanyDetailContent company={companyDetails} activities={[]} />
        </div>
        <CompanyDetailSidebar company={companyDetails} />
      </div>
    </div>
  );
};

export default CompanyDetail;
