
import { useTeammatesData } from '@/hooks/useTeammatesData';
import { useTeammateFilters } from '@/hooks/useTeammateFilters';
import { useTeammateActions } from '@/hooks/useTeammateActions';
import { useTeammateSorting } from '@/hooks/useTeammateSorting';
import { useTeammatePagination } from '@/hooks/useTeammatePagination';
import { useTeammateSelection } from '@/hooks/useTeammateSelection';

import TeammatesPageHeader from '@/components/teammates/TeammatesPageHeader';
import TeammatesFilters from '@/components/teammates/TeammatesFilters';
import TeammatesBulkActions from '@/components/teammates/TeammatesBulkActions';
import TeammatesTable from '@/components/teammates/TeammatesTable';
import LoadingState from '@/components/teammates/LoadingState';
import EmptyState from '@/components/teammates/EmptyState';
import TeammatesErrorBoundary from '@/components/teammates/TeammatesErrorBoundary';
import TeammatesErrorView from '@/components/teammates/TeammatesErrorView';

const ITEMS_PER_PAGE = 10;

const TeammatesPage = () => {
  // Data fetching
  const { teammates, loading, error, retrying, handleRetry } = useTeammatesData();

  // Filtering
  const {
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    handleQuickFilterClick,
    filteredTeammates
  } = useTeammateFilters(teammates);

  // Sorting
  const { sortBy, sortDirection, sortedTeammates, handleSort } = useTeammateSorting(filteredTeammates);

  // Pagination
  const { currentPage, setCurrentPage, totalPages, paginatedTeammates } = useTeammatePagination(
    sortedTeammates,
    ITEMS_PER_PAGE
  );

  // Selection
  const { selectedTeammates, setSelectedTeammates, handleSelectAll, handleSelectTeammate } = 
    useTeammateSelection(paginatedTeammates);

  // Teammate actions
  const { handleResendInvitation, handleUpdateTeammate } = useTeammateActions();

  if (loading) {
    return (
      <div className="p-6">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <TeammatesErrorView 
        error={error}
        onRetry={handleRetry}
        isRetrying={retrying}
      />
    );
  }

  return (
    <TeammatesErrorBoundary>
      <div className="p-6 space-y-6">
        <TeammatesPageHeader onRefresh={handleRetry} isRefreshing={retrying} />

        <TeammatesFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onQuickFilterClick={handleQuickFilterClick}
        />

        {selectedTeammates.length > 0 && (
          <TeammatesBulkActions
            selectedIds={selectedTeammates}
            onClearSelection={() => setSelectedTeammates([])}
          />
        )}

        {sortedTeammates.length === 0 ? (
          <EmptyState />
        ) : (
          <TeammatesTable
            teammates={paginatedTeammates}
            selectedTeammates={selectedTeammates}
            onSelectAll={handleSelectAll}
            onSelectTeammate={handleSelectTeammate}
            onResendInvitation={handleResendInvitation}
            onUpdateTeammate={handleUpdateTeammate}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </TeammatesErrorBoundary>
  );
};

export default TeammatesPage;
