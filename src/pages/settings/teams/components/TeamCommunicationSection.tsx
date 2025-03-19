
import { Card } from "@/components/ui/card";
import TeamChannelSelector from '@/components/teams/TeamChannelSelector';

interface TeamCommunicationSectionProps {
  selectedChatChannel?: string;
  selectedEmailChannels: string[];
  onChatChannelSelect: (channelId: string | undefined) => void;
  onEmailChannelToggle: (channelId: string) => void;
}

const TeamCommunicationSection = ({
  selectedChatChannel,
  selectedEmailChannels,
  onChatChannelSelect,
  onEmailChannelToggle,
}: TeamCommunicationSectionProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Team Communication</h2>
      <TeamChannelSelector
        selectedChatChannel={selectedChatChannel}
        selectedEmailChannels={selectedEmailChannels}
        onChatChannelSelect={onChatChannelSelect}
        onEmailChannelToggle={onEmailChannelToggle}
      />
    </Card>
  );
};

export default TeamCommunicationSection;

