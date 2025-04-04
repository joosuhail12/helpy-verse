
// src/pages/contacts/Companies.tsx
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCompanies } from '@/store/slices/companies/companiesSlice';
import { CompaniesList } from '@/components/companies/CompaniesList';
import { CompaniesHeader } from '@/components/companies/CompaniesHeader';
import { CompaniesListControls } from '@/components/companies/CompaniesListControls';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useAuthCheck } from '@/hooks/useAuthCheck';

const Companies = () => {
  const dispatch = useAppDispatch();
  const { companies, loading: companiesLoading, error: companiesError } = useAppSelector((state) => state.companies);
  const { isAuthenticated, isLoading: authLoading, error: authError } = useAuthCheck();
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCompanies());
    }
  }, [dispatch, isAuthenticated]);

  const handleRetry = () => {
    setIsRetrying(true);
    dispatch(fetchCompanies())
      .finally(() => {
        setIsRetrying(false);
      });
  };

  if (authLoading) {
    return (
      <div className="p-6">
        <Card className="p-4">
          <div className="flex flex-col items-center justify-center p-8">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-6 w-40 mt-4" />
            <Skeleton className="h-4 w-60 mt-2" />
          </div>
        </Card>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-2" />
            <h3 className="text-xl font-semibold mb-2">Authentication Error</h3>
            <p className="text-muted-foreground mb-4">{authError}</p>
            <p className="text-sm">Please sign in to view companies.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (companiesLoading || authLoading) {
    return (
      <div className="p-6">
        <Card className="p-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (companiesError) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="font-medium text-destructive">Error loading companies</p>
          </div>
          <p className="text-muted-foreground mb-4">{companiesError}</p>
          <Button 
            onClick={handleRetry} 
            disabled={isRetrying}
            className="flex gap-2 items-center"
          >
            {isRetrying && <RefreshCw className="h-4 w-4 animate-spin" />}
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <CompaniesHeader />
      <CompaniesListControls />
      <CompaniesList companies={companies} loading={companiesLoading} />
    </div>
  );
};

export default Companies;
