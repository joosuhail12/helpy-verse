
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { Team } from '@/types/team';

interface TeamsListProps {
  teams: Team[];
}

const TeamsList = ({ teams }: TeamsListProps) => {
  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <Card key={team.id}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="h-6 w-6 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">{team.name}</h3>
                <p className="text-sm text-gray-500">{team.members.length} members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeamsList;
