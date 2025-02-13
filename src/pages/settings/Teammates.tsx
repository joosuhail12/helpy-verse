
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeammates, resendInvitation } from '@/store/slices/teammatesSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import AddTeammateDialog from '@/components/teammates/AddTeammateDialog';
import { Send } from 'lucide-react';

const TeammatesPage = () => {
  const dispatch = useAppDispatch();
  const { teammates, loading, error } = useAppSelector((state) => state.teammates);
  const { toast } = useToast();

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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Teammates</h1>
        <AddTeammateDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teammates.map((teammate) => (
            <TableRow key={teammate.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={teammate.avatar} />
                    <AvatarFallback>{teammate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{teammate.name}</div>
                    <div className="text-sm text-gray-500">{teammate.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={teammate.role === 'admin' ? 'default' : 'secondary'}>
                  {teammate.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={teammate.status === 'active' ? 'default' : 'secondary'}>
                  {teammate.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(teammate.lastActive), 'MMM d, yyyy HH:mm')}
              </TableCell>
              <TableCell>
                {format(new Date(teammate.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResendInvitation(teammate.id)}
                  title="Resend invitation email"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeammatesPage;

