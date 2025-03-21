
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { fetchTeamById, deleteTeam, resetTeamDetails } from '@/store/slices/teams/teamsSlice';
import { selectTeamDetails, selectTeamsLoading, selectTeamsError } from '@/store/slices/teams/selectors';
import TeamsLoadingState from '@/components/teams/TeamsLoadingState';
import TeamMembers from '@/components/teams/detail/TeamMembers';
import TeamChannels from '@/components/teams/detail/TeamChannels';
import TeamRouting from '@/components/teams/detail/TeamRouting';
import TeamAvailability from '@/components/teams/detail/TeamAvailability';
import { useToast } from '@/hooks/use-toast';

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const team = useAppSelector(selectTeamDetails);
  const loading = useAppSelector(selectTeamsLoading);
  const error = useAppSelector(selectTeamsError);

  useEffect(() => {
    if (id) {
      dispatch(fetchTeamById(id));
    }
    
    return () => {
      // Reset team details when component unmounts
      dispatch(resetTeamDetails());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this team?')) {
      return;
    }

    try {
      await dispatch(deleteTeam(id)).unwrap();
      toast({
        title: "Team deleted",
        description: "The team has been successfully deleted.",
      });
      navigate('/home/settings/teams');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete team",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <TeamsLoadingState />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Error: {error}. Please try again later.
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-6">
        <div className="bg-amber-50 text-amber-500 p-4 rounded-lg">
          Team not found. The team might have been deleted or you may not have access to it.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home/settings/teams')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-lg">
              {team.icon || '👥'}
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">{team.name}</h1>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button
            onClick={() => navigate(`/home/settings/teams/${id}/edit`)}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-5">
          <TeamMembers team={team} />
        </Card>
        <Card className="p-5">
          <TeamChannels team={team} />
        </Card>
        <Card className="p-5">
          <TeamRouting team={team} />
        </Card>
        <Card className="p-5">
          <TeamAvailability team={team} />
        </Card>
      </div>
    </div>
  );
};

export default TeamDetail;
