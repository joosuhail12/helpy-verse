
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Users, ArrowLeft } from "lucide-react";
import TeamIconPicker from '@/components/teams/TeamIconPicker';
import TeamMembersSelector from '@/components/teams/TeamMembersSelector';
import TeamChannelSelector from '@/components/teams/TeamChannelSelector';
import TeamRoutingSelector from '@/components/teams/TeamRoutingSelector';
import TeamOfficeHoursSelector from '@/components/teams/TeamOfficeHoursSelector';
import TeamHolidaySelector from '@/components/teams/TeamHolidaySelector';
import type { DayOfWeek, TimeSlot } from '@/types/team';

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
  const [routingType, setRoutingType] = useState<'manual' | 'round-robin' | 'load-balanced'>('manual');
  const [routingLimits, setRoutingLimits] = useState<{
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  }>({});
  const [officeHours, setOfficeHours] = useState<{ [key in DayOfWeek]: TimeSlot[] }>({
    monday: [{ start: '09:00', end: '17:00' }],
    tuesday: [{ start: '09:00', end: '17:00' }],
    wednesday: [{ start: '09:00', end: '17:00' }],
    thursday: [{ start: '09:00', end: '17:00' }],
    friday: [{ start: '09:00', end: '17:00' }],
    saturday: [],
    sunday: []
  });
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);

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
          routing: {
            type: routingType,
            ...(routingType === 'load-balanced' && {
              limits: routingLimits
            })
          },
          officeHours,
          holidays: selectedHolidays,
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
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home/settings/teams')}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold text-gray-900">Create New Team</h1>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
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
              teammates={teammates}
              selectedTeammates={selectedTeammates}
              onTeammateToggle={toggleTeammate}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Team Communication</h2>
          <TeamChannelSelector
            selectedChatChannel={selectedChatChannel}
            selectedEmailChannels={selectedEmailChannels}
            onChatChannelSelect={setSelectedChatChannel}
            onEmailChannelToggle={handleEmailChannelToggle}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Ticket Routing</h2>
          <TeamRoutingSelector
            selectedType={routingType}
            onTypeSelect={setRoutingType}
            limits={routingLimits}
            onLimitsChange={setRoutingLimits}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Team Availability</h2>
          <div className="space-y-8">
            <TeamOfficeHoursSelector
              officeHours={officeHours}
              onOfficeHoursChange={setOfficeHours}
            />
            <Separator className="my-8" />
            <TeamHolidaySelector
              selectedHolidays={selectedHolidays}
              onHolidaysChange={setSelectedHolidays}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/home/settings/teams')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateTeam}
            disabled={!teamName.trim()}
            className="px-8"
          >
            Create Team
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;

