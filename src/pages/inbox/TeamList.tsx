import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeams } from '@/contexts/TeamsContext';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const TeamList = () => {
    const { teams, loading, error, fetchTeams, hasLoaded } = useTeams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!hasLoaded && !loading) {
            fetchTeams();
        }
    }, [fetchTeams, hasLoaded, loading]);

    return (
        <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
            <div className="p-4 border-b">
                <h1 className="text-xl font-semibold">All Teams</h1>
                <p className="text-muted-foreground text-sm">
                    View tickets by team
                </p>
            </div>
            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-40 text-red-500">
                        {error}
                    </div>
                ) : teams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                        <Users className="h-16 w-16 mb-4 text-muted-foreground/50" />
                        <p className="text-center">No teams found</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => navigate('/home/settings/teams/create')}
                        >
                            Create a Team
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teams.map(team => (
                            <div
                                key={team.id}
                                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                                onClick={() => navigate(`/home/inbox/teams/${team.id}`)}
                            >
                                <div className="p-4 flex flex-col">
                                    <h3 className="font-medium text-lg">{team.name}</h3>
                                    <p className="text-muted-foreground text-sm truncate mt-1">
                                        {team.description || 'No description available'}
                                    </p>
                                    <div className="mt-4 flex justify-end">
                                        <Button size="sm" variant="ghost">
                                            View Tickets
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamList; 