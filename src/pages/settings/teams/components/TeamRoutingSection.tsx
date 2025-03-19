
import React, { useState } from 'react';
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
  routingType?: 'manual' | 'round-robin' | 'load-balanced';
  setRoutingType?: React.Dispatch<React.SetStateAction<'manual' | 'round-robin' | 'load-balanced'>>;
  routingLimits?: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  };
  setRoutingLimits?: React.Dispatch<React.SetStateAction<{
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  }>>;
}

const TeamRoutingSection: React.FC<TeamRoutingSectionProps> = ({
  teamId,
  initialRoutingType = 'manual',
  initialLimits = {},
  readonly = false,
  routingType,
  setRoutingType,
  routingLimits,
  setRoutingLimits
}) => {
  const [localRoutingType, setLocalRoutingType] = useState<'manual' | 'round-robin' | 'load-balanced'>(initialRoutingType);
  const [localLimits, setLocalLimits] = useState({
    maxTickets: initialLimits.maxTickets,
    maxOpenTickets: initialLimits.maxOpenTickets,
    maxActiveChats: initialLimits.maxActiveChats
  });

  // Use either props or local state
  const effectiveRoutingType = routingType || localRoutingType;
  const effectiveSetRoutingType = setRoutingType || setLocalRoutingType;
  const effectiveLimits = routingLimits || localLimits;
  
  const handleLimitsChange = (newLimits: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  }) => {
    if (setRoutingLimits) {
      setRoutingLimits(newLimits);
    } else {
      setLocalLimits(newLimits as any);
    }
  };

  if (readonly) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ticket Routing</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Routing Type: {effectiveRoutingType}</p>
          {/* Display limits if not manual */}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Ticket Routing</h2>
      <TeamRoutingSelector
        selectedType={effectiveRoutingType}
        onTypeSelect={effectiveSetRoutingType}
        limits={effectiveLimits}
        onLimitsChange={handleLimitsChange}
      />
    </Card>
  );
};

export default TeamRoutingSection;
