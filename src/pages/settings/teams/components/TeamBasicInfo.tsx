
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TeamIconPicker } from "@/components/teams/TeamIconPicker";
import TeamMembersSelector from '@/components/teams/TeamMembersSelector';
import { Teammate } from '@/types/teammate';

interface TeamBasicInfoProps {
  teamName: string;
  setTeamName: (name: string) => void;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  teammates: Teammate[];
  selectedTeammates: string[];
  onTeammateToggle: (teammateId: string) => void;
}

const TeamBasicInfo = ({
  teamName,
  setTeamName,
  selectedIcon,
  setSelectedIcon,
  teammates,
  selectedTeammates,
  onTeammateToggle,
}: TeamBasicInfoProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Basic Information</h2>
      
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="team-name">Team Name</Label>
          <Input
            id="team-name"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="team-icon">Team Icon</Label>
          <TeamIconPicker 
            selectedIcon={selectedIcon}
            onIconSelect={setSelectedIcon}
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="team-description">Description</Label>
          <Textarea
            id="team-description"
            placeholder="Describe the purpose of this team"
            className="min-h-[100px]"
          />
        </div>
        
        <Separator className="my-2" />
        
        <div className="grid gap-3">
          <Label>Team Members</Label>
          <TeamMembersSelector
            teammates={teammates}
            selectedTeammates={selectedTeammates}
            onTeammateToggle={onTeammateToggle}
          />
        </div>
      </div>
    </Card>
  );
};

export default TeamBasicInfo;
