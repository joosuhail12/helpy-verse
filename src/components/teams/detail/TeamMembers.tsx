
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Team } from '@/types/team';

interface TeamMembersProps {
  team: Team;
}

const TeamMembers = ({ team }: TeamMembersProps) => {
  const members = team.members || [];
  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
          </div>
          <Badge variant="secondary">Member</Badge>
        </div>
      ))}
    </div>
  );
};

export default TeamMembers;
