
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ChevronRight } from "lucide-react";
import type { Team } from '@/types/team';

interface TeamsListProps {
  teams: Team[];
}

const TeamsList = ({ teams }: TeamsListProps) => {
  const navigate = useNavigate();
  
  // Handle different member formats
  const getMemberCount = (team: Team): number => {
    if (team.teamMembers && team.teamMembers.length > 0) {
      return team.teamMembers.length;
    }
    
    if (team.members && team.members.length > 0) {
      return team.members.length;
    }
    
    return 0;
  };

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <Card key={team.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full p-0 h-auto hover:bg-transparent"
              onClick={() => navigate(`/home/settings/teams/${team.id}`)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                    {team.icon || '👥'}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-500">
                      {getMemberCount(team)} members
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeamsList;
