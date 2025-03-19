
import React, { useState } from 'react';
// Fix the import to use named import
import { TeamRoutingSelector } from '@/components/teams/TeamRoutingSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamRoutingSectionProps {
  teamId?: string;
  initialRoutingType?: 'manual' | 'round-robin' | 'load-balanced';
  initialLimits?: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  };
  readonly?: boolean;
}

const TeamRoutingSection: React.FC<TeamRoutingSectionProps> = ({
  teamId,
  initialRoutingType = 'manual',
  initialLimits = {},
  readonly = false
}) => {
  const [routingType, setRoutingType] = useState<'manual' | 'round-robin' | 'load-balanced'>(initialRoutingType);
  const [limits, setLimits] = useState({
    maxTickets: initialLimits.maxTickets,
    maxOpenTickets: initialLimits.maxOpenTickets,
    maxActiveChats: initialLimits.maxActiveChats
  });

  if (readonly) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ticket Routing</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Routing Type: {routingType}</p>
          {/* Display limits if not manual */}
        </CardContent>
      </Card>
    );
  }

  return (
    <TeamRoutingSelector
      selectedType={routingType}
      onTypeSelect={setRoutingType}
      limits={limits}
      onLimitsChange={setLimits}
    />
  );
};

export default TeamRoutingSection;
