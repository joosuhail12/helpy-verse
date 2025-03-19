
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, ArrowLeft } from "lucide-react";
import TeamBasicInfo from './teams/components/TeamBasicInfo';
import TeamCommunicationSection from './teams/components/TeamCommunicationSection';
import TeamRoutingSection from './teams/components/TeamRoutingSection';
import TeamAvailabilitySection from './teams/components/TeamAvailabilitySection';
import { createTeam } from './teams/utils/createTeamUtils';
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
  const [officeHours, setOfficeHours] = useState<{ [key in DayOfWeek]?: TimeSlot[] }>({
    [DayOfWeek.Monday]: [{ start: '09:00', end: '17:00' }],
    [DayOfWeek.Tuesday]: [{ start: '09:00', end: '17:00' }],
    [DayOfWeek.Wednesday]: [{ start: '09:00', end: '17:00' }],
    [DayOfWeek.Thursday]: [{ start: '09:00', end: '17:00' }],
    [DayOfWeek.Friday]: [{ start: '09:00', end: '17:00' }],
    [DayOfWeek.Saturday]: [],
    [DayOfWeek.Sunday]: []
  });
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);

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
      const success = await createTeam({
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
      });

      if (success) {
        toast({
          title: "Success",
          description: "Team created successfully",
        });
        navigate('/home/settings/teams');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      });
    }
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
        <TeamBasicInfo
          teamName={teamName}
          setTeamName={setTeamName}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          teammates={teammates}
          selectedTeammates={selectedTeammates}
          onTeammateToggle={toggleTeammate}
        />

        <TeamCommunicationSection
          selectedChatChannel={selectedChatChannel}
          selectedEmailChannels={selectedEmailChannels}
          onChatChannelSelect={setSelectedChatChannel}
          onEmailChannelToggle={handleEmailChannelToggle}
        />

        <TeamRoutingSection
          routingType={routingType}
          setRoutingType={setRoutingType}
          routingLimits={routingLimits}
          setRoutingLimits={setRoutingLimits}
        />

        <TeamAvailabilitySection
          officeHours={officeHours}
          onOfficeHoursChange={(hours) => {
            // Transform hours to ensure all keys have arrays
            const updatedHours: { [key in DayOfWeek]?: TimeSlot[] } = { ...hours };
            Object.values(DayOfWeek).forEach(day => {
              if (!updatedHours[day]) {
                updatedHours[day] = [];
              }
            });
            setOfficeHours(updatedHours);
          }}
          selectedHolidays={selectedHolidays}
          onHolidaysChange={setSelectedHolidays}
        />

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
