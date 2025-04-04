
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import TeamsLoadingState from '@/components/teams/TeamsLoadingState';
import TeamEditHeader from '@/components/teams/detail/TeamEditHeader';
import TeamEditForm from '@/components/teams/detail/TeamEditForm';

const EditTeam = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const teammates = useAppSelector((state) => state.teammates?.teammates || []);
  const { teams, loading, error } = useAppSelector((state) => state.teams || { teams: [], loading: false, error: null });
  const team = teams.find(t => t.id === id);

  if (loading) {
    return <TeamsLoadingState />;
  }

  if (!team) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Team not found. The team might have been deleted or you may not have access to it.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <TeamEditHeader teamName={team.name} teamId={team.id} />
      <TeamEditForm 
        team={team} 
        teammates={teammates}
        onSuccess={() => navigate(`/home/settings/teams/${id}`)}
      />
    </div>
  );
};

export default EditTeam;
