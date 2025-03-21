
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TeamMembersProps {
  teamMembers: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

const TeamMembers = ({ teamMembers }: TeamMembersProps) => {
  return (
    <div className="space-y-4"> 
      {teamMembers.map((member) => (
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
