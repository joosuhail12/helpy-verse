
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
import { RefreshCw, ServerCrash, WifiOff } from 'lucide-react';
import { HttpClient } from '@/api/services/http/client';

const Companies = () => {
  const dispatch = useAppDispatch();
  const { companies, loading, error } = useAppSelector((state) => state.companies);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'online' | 'offline' | 'error'>('checking');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkConnection = async () => {
      setConnectionStatus('checking');
      try {
        const isConnected = await HttpClient.checkApiConnection();
        setConnectionStatus(isConnected ? 'online' : 'error');
      } catch (error) {
        console.error('Error checking connection:', error);
        setConnectionStatus(navigator.onLine ? 'error' : 'offline');
      }
    };
    
    checkConnection();
  }, [retryCount]);

  useEffect(() => {
    if (connectionStatus === 'online') {
      console.log('Fetching companies data');
      dispatch(fetchCompanies());
    }
  }, [dispatch, connectionStatus, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (connectionStatus === 'offline') {
    return (
      <div className="p-6">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <WifiOff className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">You're offline</h3>
          <p className="text-muted-foreground mb-6">
            Please check your internet connection and try again.
          </p>
          <Button onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  if (connectionStatus === 'error' && !loading) {
    return (
      <div className="p-6">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <ServerCrash className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Unable to connect to server</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't connect to the API server. Please check your network connection and server status.
          </p>
          <Button onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  if (loading || connectionStatus === 'checking') {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-4 text-red-500">
          Error loading companies: {error}
          <Button onClick={handleRetry} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
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
