import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeammates, resendInvitation } from '@/store/slices/teammates/actions';
import { useToast } from "@/hooks/use-toast";
import AddTeammateDialog from '@/components/teammates/AddTeammateDialog';
import TeammatesBulkActions from '@/components/teammates/TeammatesBulkActions';
import TeammatesFilters from '@/components/teammates/TeammatesFilters';
import TeammatesTable from '@/components/teammates/TeammatesTable';
import { useTeammateFilters } from '@/hooks/useTeammateFilters';
import LoadingState from '@/components/teammates/LoadingState';
import EmptyState from '@/components/teammates/EmptyState';
import TeammatesErrorBoundary from '@/components/teammates/TeammatesErrorBoundary';
import type { Teammate } from '@/types/teammate';
import { selectAllTeammates, selectTeammatesLoading, selectTeammatesError } from '@/store/slices/teammates/selectors';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogIn, RefreshCw } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const TeammatesPage = () => {
  const dispatch = useAppDispatch();
  const teammates = useAppSelector(selectAllTeammates);
  const loading = useAppSelector(selectTeammatesLoading);
  const error = useAppSelector(selectTeammatesError);
  const { toast } = useToast();
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Teammate | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [retrying, setRetrying] = useState(false);

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
    if (!localStorage.getItem('workspaceId') && import.meta.env.DEV) {
      const defaultWorkspaceId = '6c22b22f-7bdf-43db-b7c1-9c5884125c63';
      localStorage.setItem('workspaceId', defaultWorkspaceId);
      console.log(`Set default workspace ID for development: ${defaultWorkspaceId}`);
    }
  }, []);

  useEffect(() => {
    const workspaceId = localStorage.getItem('workspaceId');
    if (workspaceId) {
      console.log(`Initial teammates fetch with workspace ID: ${workspaceId}`);
      dispatch(fetchTeammates())
        .unwrap()
        .catch(err => {
          console.error('Error in initial teammates fetch:', err);
          toast({
            title: "Error Loading Teammates",
            description: typeof err === 'string' ? err : "Failed to load teammates. Please try again.",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Workspace ID Missing",
        description: "No workspace ID found. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [dispatch, toast]);

  const handleRetry = () => {
    setRetrying(true);
    const workspaceId = localStorage.getItem('workspaceId');
    if (!workspaceId) {
      toast({
        title: "Workspace ID Missing",
        description: "No workspace ID found. Please refresh the page.",
        variant: "destructive",
      });
      setRetrying(false);
      return;
    }
    
    dispatch(fetchTeammates())
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "Teammates data refreshed successfully.",
        });
      })
      .catch((err) => {
        const errorMessage = typeof err === 'string' 
          ? err 
          : err?.message || "Failed to fetch teammates. Please try again.";
          
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      })
      .finally(() => {
        setRetrying(false);
      });
  };

  const handleLogin = () => {
    window.location.href = '/signin';
  };

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

  const handleUpdateTeammate = async (teammateId: string, updates: Partial<Teammate>) => {
    try {
      toast({
        title: "Success",
        description: "Teammate information has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update teammate information. Please try again.",
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
    const isAuthError = typeof error === 'string' && 
      (error.includes('authentication') || error.includes('Authentication') || 
       error.includes('auth token') || error.includes('Unauthorized') ||
       error.includes('UNAUTHORIZED') || error.includes('login'));
    
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[50vh]">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">Failed to load teammates</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          {typeof error === 'string' 
            ? error 
            : error?.message || 'There was an error loading your teammates. Please try again.'}
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={handleRetry} 
            disabled={retrying} 
            className="flex items-center gap-2"
          >
            {retrying && <RefreshCw className="h-4 w-4 animate-spin" />}
            {retrying ? 'Retrying...' : 'Retry'}
          </Button>
          
          {isAuthError && (
            <Button 
              onClick={handleLogin}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Sign In Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <TeammatesErrorBoundary>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Teammates</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRetry}
              className="flex items-center gap-2"
              disabled={retrying}
            >
              <RefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <AddTeammateDialog />
          </div>
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
