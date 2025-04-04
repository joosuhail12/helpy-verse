
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import TeammatesHeader from './components/TeammatesHeader';
import TeammatesTable from '@/components/teammates/TeammatesTable';
import TeammatesFilters from './components/TeammatesFilters';
import TeammatesEmptyState from './components/TeammatesEmptyState';
import TeammatesErrorView from '@/components/teammates/TeammatesErrorView';
import { useTeammatesData } from '@/hooks/useTeammatesData';
import { useTeammateActions } from '@/hooks/useTeammateActions';
import { useTeammatesTableData } from './hooks/useTeammatesTableData';
import type { Teammate } from '@/types/teammate';

/**
 * TeammatesPage component displays a list of all teammates
 */
const TeammatesPage = () => {
  const { teammates, loading, error, retrying, handleRetry } = useTeammatesData();
  const { handleResendInvitation } = useTeammateActions();
  const { 
    filteredTeammates, 
    selectedTeammates,
    sortBy,
    sortDirection,
    currentPage,
    pageSize,
    handleSort,
    handleSelectAll,
    handleSelectTeammate,
    handlePageChange,
    totalPages
  } = useTeammatesTableData(teammates);
  
  // Show loading state
  if (loading && !retrying) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading teammates...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && teammates.length === 0) {
    return (
      <TeammatesErrorView 
        error={error}
        onRetry={handleRetry}
        isRetrying={retrying}
      />
    );
  }

  // Show empty state
  if (teammates.length === 0) {
    return <TeammatesEmptyState />;
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="p-6 space-y-6">
        <TeammatesHeader />
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium mb-1">
              All Teammates ({teammates.length})
            </h2>
            <p className="text-sm text-gray-500">
              Manage your workspace teammates and permissions
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Teammate
          </Button>
        </div>

        <TeammatesFilters 
          totalCount={teammates.length}
          selectedCount={selectedTeammates.length}
        />
        
        <TeammatesTable 
          teammates={filteredTeammates}
          selectedTeammates={selectedTeammates}
          onSelectAll={handleSelectAll}
          onSelectTeammate={handleSelectTeammate}
          onResendInvitation={handleResendInvitation}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </ScrollArea>
  );
};

export default TeammatesPage;
