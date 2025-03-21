
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CompanyDetailHeader } from '@/components/companies/detail/CompanyDetailHeader';
import { CompanyDetailContent } from '@/components/companies/detail/CompanyDetailContent';
import { CompanyDetailLoading } from '@/components/companies/detail/CompanyDetailLoading';
import { CompanyDetailError } from '@/components/companies/detail/CompanyDetailError';
import { CompanyNotFound } from '@/components/companies/detail/CompanyNotFound';
import { useCompanyDetails } from '@/hooks/useCompanyDetails';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    company, 
    loading, 
    error, 
    isRetrying, 
    retryCount,
    activities,
    loadCompanyDetails, 
    handleRetry, 
    handleGoBack, 
    handleDeleteClick 
  } = useCompanyDetails(id);

  useEffect(() => {
    loadCompanyDetails();
  }, [id]);

  useEffect(() => {
    if (error && retryCount < 1 && !isRetrying) {
      const timer = setTimeout(() => {
        loadCompanyDetails();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, isRetrying]);

  if (loading || isRetrying) {
    return <CompanyDetailLoading />;
  }

  if (error) {
    return <CompanyDetailError onRetry={handleRetry} onGoBack={handleGoBack} />;
  }

  if (!company) {
    return <CompanyNotFound onGoBack={handleGoBack} />;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1400px]">
      <CompanyDetailHeader company={company} onDeleteClick={handleDeleteClick} />
      <CompanyDetailContent company={company} activities={activities} />
    </div>
  );
};

export default CompanyDetail;
