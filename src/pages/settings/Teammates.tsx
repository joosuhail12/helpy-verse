
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

const TeammatesPage = () => {
  const dispatch = useAppDispatch();
  const { teammates, loading, error } = useAppSelector((state) => state.teammates);
  const { toast } = useToast();
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([]);

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
      setSelectedTeammates(filteredTeammates.map(t => t.id));
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

      {filteredTeammates.length === 0 ? (
        <EmptyState />
      ) : (
        <TeammatesTable
          teammates={filteredTeammates}
          selectedTeammates={selectedTeammates}
          onSelectAll={handleSelectAll}
          onSelectTeammate={handleSelectTeammate}
          onResendInvitation={handleResendInvitation}
        />
      )}
    </div>
  );
};

export default TeammatesPage;
