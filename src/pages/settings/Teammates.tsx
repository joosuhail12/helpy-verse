
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeammates, resendInvitation } from '@/store/slices/teammatesSlice';
import { useToast } from "@/hooks/use-toast";
import AddTeammateDialog from '@/components/teammates/AddTeammateDialog';
import TeammatesBulkActions from '@/components/teammates/TeammatesBulkActions';
import TeammatesFilters from '@/components/teammates/TeammatesFilters';
import TeammatesTable from '@/components/teammates/TeammatesTable';
import { useTeammateFilters } from '@/hooks/useTeammateFilters';
import LoadingState from '@/components/teammates/LoadingState';
import EmptyState from '@/components/teammates/EmptyState';
import type { Teammate } from '@/types/teammate';

const ITEMS_PER_PAGE = 10;

const TeammatesPage = () => {
  const dispatch = useAppDispatch();
  const { teammates, loading, error } = useAppSelector((state) => state.teammates);
  const { toast } = useToast();
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Teammate | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  useEffect(() => {
    dispatch(fetchTeammates());
  }, [dispatch]);

  const handleResendInvitation = async (teammateId: string) => {
    try {
      await dispatch(resendInvitation(teammateId)).unwrap();
      toast({
        title: "Success",
        description: "Invitation email has been resent.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTeammates(paginatedTeammates.map(t => t.id));
    } else {
      setSelectedTeammates([]);
    }
  };

  const handleSelectTeammate = (teammateId: string, checked: boolean) => {
    if (checked) {
      setSelectedTeammates(prev => [...prev, teammateId]);
    } else {
      setSelectedTeammates(prev => prev.filter(id => id !== teammateId));
    }
  };

  const handleSort = (column: keyof Teammate) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedTeammates = [...filteredTeammates].sort((a, b) => {
    if (!sortBy) return 0;
    
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const totalPages = Math.ceil(sortedTeammates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTeammates = sortedTeammates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="p-6">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Teammates</h1>
        <AddTeammateDialog />
      </div>

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
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default TeammatesPage;
