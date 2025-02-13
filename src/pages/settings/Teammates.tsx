
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeammates, resendInvitation, toggleTeammateSelection, clearTeammateSelection, setSortField } from '@/store/slices/teammatesSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import AddTeammateDialog from '@/components/teammates/AddTeammateDialog';
import EditTeammateDialog from '@/components/teammates/EditTeammateDialog';
import BulkActions from '@/components/teammates/BulkActions';
import { Pen, Send, ArrowUp, ArrowDown } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import type { Teammate } from '@/types/teammate';

const TeammatesPage = () => {
  const dispatch = useAppDispatch();
  const { teammates, loading, error, selectedTeammates, sortField, sortDirection } = useAppSelector((state) => state.teammates);
  const { toast } = useToast();
  const [teammateToEdit, setTeammateToEdit] = useState<Teammate | null>(null);

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

  const handleSort = (field: keyof Teammate) => {
    dispatch(setSortField(field));
  };

  const getSortIcon = (field: keyof Teammate) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const sortedTeammates = [...teammates].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return aValue < bValue ? -1 * multiplier : aValue > bValue ? 1 * multiplier : 0;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
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
    <div className="p-6 space