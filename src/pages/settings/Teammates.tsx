
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeammatesData } from '@/hooks/useTeammatesData';
import TeammatesHeader from '@/components/teammates/TeammatesHeader';
import TeammatesList from '@/components/teammates/TeammatesList';
import TeammatesEmptyState from '@/components/teammates/TeammatesEmptyState';
import TeammatesLoadingState from '@/components/teammates/TeammatesLoadingState';
import TeammatesErrorView from '@/components/teammates/TeammatesErrorView';
import { Card } from '@/components/ui/card';
import { useAuthCheck } from '@/hooks/useAuthCheck';

const Teammates: React.FC = () => {
  const navigate = useNavigate();
  const { teammates, loading: teammatesLoading, error: teammatesError, retrying, handleRetry } = useTeammatesData();
  const { isAuthenticated, isLoading: authLoading, error: authError } = useAuthCheck();

  useEffect(() => {
    console.log('Teammates page mounted, auth status:', isAuthenticated);
  }, [isAuthenticated]);

  const handleAddTeammate = () => {
    navigate('/home/settings/teammates/create');
  };

  // Combined loading state
  if (authLoading || teammatesLoading) {
    return <TeammatesLoadingState />;
  }

  // Auth error takes precedence
  if (authError) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Authentication Error</h3>
            <p className="text-muted-foreground mb-4">{authError}</p>
            <p className="text-sm">Please sign in to view teammates.</p>
          </div>
        </Card>
      </div>
    );
  }

  // Then check for data-specific errors
  if (teammatesError) {
    return (
      <TeammatesErrorView 
        error={teammatesError} 
        onRetry={handleRetry} 
        isRetrying={retrying} 
      />
    );
  }

  return (
    <div className="container p-6 mx-auto">
      <TeammatesHeader onAddTeammate={handleAddTeammate} />
      
      {teammates && teammates.length > 0 ? (
        <TeammatesList teammates={teammates} />
      ) : (
        <TeammatesEmptyState onAddTeammate={handleAddTeammate} />
      )}
    </div>
  );
};

export default Teammates;
