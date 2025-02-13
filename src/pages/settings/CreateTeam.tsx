
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import TeamIconPicker from '@/components/teams/TeamIconPicker';
import TeamMembersSelector from '@/components/teams/TeamMembersSelector';
import TeamChannelSelector from '@/components/teams/TeamChannelSelector';

const CreateTeam = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const teammates = useAppSelector((state) => state.teammates.teammates);

  const [teamName, setTeamName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([]);
  const [selectedChatChannel, setSelectedChatChannel] = useState<string>();
  const [selectedEmailChannels, setSelectedEmailChannels] = useState<string[]>([]);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: teamName,
          icon: selectedIcon,
          members: selectedTeammates,
          channels: {
            chat: selectedChatChannel,
            email: selectedEmailChannels,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create team');
      }

      toast({
        title: "Success",
        description: "Team created successfully",
      });
      navigate('/home/settings/teams');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTeammate = (teammateId: string) => {
    setSelectedTeammates(prev =>
      prev.includes(teammateId)
        ? prev.filter(id => id !== teammateId)
        : [...prev, teammateId]
    );
  };

  const handleEmailChannelToggle = (channelId: string) => {
    setSelectedEmailChannels(prev =>
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Team</h1>
        <Button variant="outline" onClick={() => navigate('/home/settings/teams')}>
          Cancel
        </Button>
      </div>

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
          teammates={teammates}
          selectedTeammates={selectedTeammates}
          onTeammateToggle={toggleTeammate}
        />

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Team Channels</h2>
          <TeamChannelSelector
            selectedChatChannel={selectedChatChannel}
            selectedEmailChannels={selectedEmailChannels}
            onChatChannelSelect={setSelectedChatChannel}
            onEmailChannelToggle={handleEmailChannelToggle}
          />
        </div>

        <Button
          className="w-full mt-6"
          onClick={handleCreateTeam}
          disabled={!teamName.trim()}
        >
          Create Team
        </Button>
      </div>
    </div>
  );
};

export default CreateTeam;
