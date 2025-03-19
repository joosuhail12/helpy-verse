
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TeamIconPicker } from "@/components/teams/TeamIconPicker";
import TeamMembersSelector from "@/components/teams/TeamMembersSelector";
import { TeamBasicInfoProps } from "@/types/team";

const TeamBasicInfo = ({ 
  teamName,
  setTeamName,
  selectedIcon,
  setSelectedIcon,
  teammates,
  selectedTeammates,
  onTeammateToggle
}: TeamBasicInfoProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Basic Information</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="team-name">Team Name</Label>
          <Input
            id="team-name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Team Icon</Label>
          <TeamIconPicker
            selectedIcon={selectedIcon}
            setSelectedIcon={setSelectedIcon}
          />
        </div>
        
        <Separator className="my-6" />
        
        <TeamMembersSelector
          teammates={teammates}
          selectedTeammates={selectedTeammates}
          onTeammateToggle={onTeammateToggle}
          selectedMembers={[]}
          onMemberSelect={() => {}}
        />
      </div>
    </Card>
  );
};

export default TeamBasicInfo;
