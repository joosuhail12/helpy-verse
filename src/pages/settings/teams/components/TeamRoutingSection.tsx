
import { Card } from "@/components/ui/card";
import { TeamRoutingSelector } from "@/components/teams/TeamRoutingSelector";

interface TeamRoutingSectionProps {
  routingType: 'manual' | 'round-robin' | 'load-balanced';
  setRoutingType: (type: 'manual' | 'round-robin' | 'load-balanced') => void;
  routingLimits: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  };
  setRoutingLimits: (limits: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  }) => void;
}

const TeamRoutingSection = ({
  routingType,
  setRoutingType,
  routingLimits,
  setRoutingLimits,
}: TeamRoutingSectionProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Ticket Routing</h2>
      <TeamRoutingSelector
        selectedType={routingType}
        onTypeSelect={setRoutingType}
        limits={routingLimits}
        onLimitsChange={setRoutingLimits}
      />
    </Card>
  );
};

export default TeamRoutingSection;
