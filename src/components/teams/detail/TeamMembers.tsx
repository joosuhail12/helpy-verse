
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Team } from '@/types/team';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectAllTeammates } from '@/store/slices/teammates/selectors';

interface TeamMembersProps {
  team: Team;
}

const TeamMembers = ({ team }: TeamMembersProps) => {
  const allTeammates = useAppSelector(selectAllTeammates);
  
  // Handle different member formats from backend
  const getTeamMembers = () => {
    // If we have teamMembers objects with full details
    if (team?.teamMembers && Array.isArray(team.teamMembers) && team.teamMembers.length > 0) {
      return team.teamMembers;
    }
    
    // If we have members array with just IDs
    if (team?.members && Array.isArray(team.members) && team.members.length > 0) {
      return team.members.map(memberId => {
        const teammate = allTeammates.find(t => t.id === memberId);
        return teammate ? {
          id: teammate.id,
          name: teammate.name,
          email: teammate.email,
          avatar: teammate.avatar
        } : {
          id: memberId,
          name: 'Unknown Member',
          email: 'No email available',
          avatar: undefined
        };
      });
    }
    
    return [];
  };
  
  const members = getTeamMembers();
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg mb-4">Team Members</h3>
      {members.length > 0 ? (
        members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{member.name || 'Unknown'}</p>
                <p className="text-sm text-gray-500">{member.email || 'No email'}</p>
              </div>
            </div>
            <Badge variant="secondary">Member</Badge>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No team members added yet.
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
