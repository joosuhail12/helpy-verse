
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import TeamIconPicker from '@/components/teams/TeamIconPicker';
import TeamMembersSelector from '@/components/teams/TeamMembersSelector';
import type { Teammate } from '@/types/teammate';

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
      <h2 className="text-lg font-semibold mb-6">Team Information</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="teamName">Team Name</Label>
          <Input
            id="teamName"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>

        <TeamIconPicker
          selectedIcon={selectedIcon}
          onIconSelect={setSelectedIcon}
        />

        <TeamMembersSelector
          teammates={teammates.map(t => ({
            id: t.id,
            name: t.name,
            email: t.email,
            avatar: t.avatar || '',
            role: t.role,
            status: t.status
          }))}
          selectedTeammates={selectedTeammates}
          onTeammateToggle={onTeammateToggle}
        />
      </div>
    </Card>
  );
};

export default TeamBasicInfo;
