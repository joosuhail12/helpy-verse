
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, User, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeammates } from '@/store/slices/teammates/actions';
import { selectAllTeammates, selectTeammatesLoading, selectTeammatesError } from '@/store/slices/teammates/selectors';
import { useTeammateFilters } from '@/hooks/useTeammateFilters';
import { useTeammateSorting } from '@/hooks/useTeammateSorting';
import { useTeammatePagination } from '@/hooks/useTeammatePagination';
import { useTeammateSelection } from '@/hooks/useTeammateSelection';
import { useTeammateActions } from '@/hooks/useTeammateActions';

const ITEMS_PER_PAGE = 10;

const TeammatesPage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const teammates = useAppSelector(selectAllTeammates);
  const loading = useAppSelector(selectTeammatesLoading);
  const error = useAppSelector(selectTeammatesError);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const {
    sortBy,
    sortDirection,
    sortedTeammates,
    handleSort
  } = useTeammateSorting(filteredTeammates);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedTeammates
  } = useTeammatePagination(sortedTeammates, ITEMS_PER_PAGE);

  const {
    selectedTeammates,
    handleSelectAll,
    handleSelectTeammate
  } = useTeammateSelection(paginatedTeammates);

  const {
    handleResendInvitation
  } = useTeammateActions();

  useEffect(() => {
    dispatch(fetchTeammates())
      .catch(error => {
        toast({
          title: "Error",
          description: "Failed to load teammates. Please try again.",
          variant: "destructive",
        });
      });
  }, [dispatch, toast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchTeammates()).unwrap();
      toast({
        title: "Success",
        description: "Teammates list refreshed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh teammates list",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Failed to load teammates: {error}. Please try again.
        </div>
        <Button variant="outline" onClick={handleRefresh} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <UsersRound className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Teammates</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/home/settings/teammates/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Teammate
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <Input
            placeholder="Search teammates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={selectedTeammates.length === paginatedTeammates.length && paginatedTeammates.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                </TableHead>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[60px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedTeammates.length > 0 ? (
                paginatedTeammates.map((teammate) => (
                  <TableRow key={teammate.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedTeammates.includes(teammate.id)}
                        onChange={(e) => handleSelectTeammate(teammate.id, e.target.checked)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <Link to={`/home/settings/teammates/${teammate.id}`} className="flex items-center gap-2 hover:underline">
                        <div className="bg-gray-100 p-1 rounded-full">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        {teammate.name}
                      </Link>
                    </TableCell>
                    <TableCell>{teammate.email}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {teammate.role || 'Agent'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        teammate.status === 'active' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-gray-50 text-gray-700'
                      }`}>
                        {teammate.status || 'inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {teammate.lastActive 
                        ? new Date(teammate.lastActive).toLocaleDateString() 
                        : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (teammate.status !== 'active') {
                            handleResendInvitation(teammate.id);
                          }
                        }}
                        disabled={teammate.status === 'active'}
                      >
                        {teammate.status === 'active' ? 'Active' : 'Resend Invite'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <UsersRound className="h-8 w-8 text-gray-300" />
                      <p className="text-gray-500">No teammates found</p>
                      {searchQuery && (
                        <Button variant="link" onClick={() => setSearchQuery('')}>
                          Clear search
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center p-4 border-t">
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeammatesPage;
