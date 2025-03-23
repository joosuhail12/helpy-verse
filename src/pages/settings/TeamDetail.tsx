
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams } from '@/store/slices/teams/teamsSlice';
import { selectTeamDetails, selectTeamsLoading, selectTeamsError } from '@/store/slices/teams/selectors';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const TeamDetail = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const teamDetails = useSelector(selectTeamDetails);
  const loading = useSelector(selectTeamsLoading);
  const error = useSelector(selectTeamsError);
  const { toast } = useToast();

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeams({}) as any);
    }
  }, [teamId, dispatch]);

  const handleDeleteTeam = async () => {
    setIsDeleting(true);
    try {
      // Simulate API deletion
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Team Deleted",
        description: "The team has been successfully deleted.",
      });
      navigate('/settings/teams');
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the team. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div>Loading team details...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!teamDetails) {
    return <div>Team not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{teamDetails.name}</CardTitle>
          <div className="space-x-2">
            <Button variant="ghost" onClick={() => navigate(`/settings/teams/edit/${teamId}`)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDeleteTeam} disabled={isDeleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-1">
            <CardDescription>Team ID</CardDescription>
            <p className="text-sm text-muted-foreground">{teamDetails.id}</p>
          </div>
          <div className="space-y-1">
            <CardDescription>Description</CardDescription>
            <p className="text-sm text-muted-foreground">{teamDetails.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamDetail;
