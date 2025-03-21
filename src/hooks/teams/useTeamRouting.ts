
import { useState } from 'react';

export const useTeamRouting = (
  initialType: 'manual' | 'round-robin' | 'load-balanced' = 'manual',
  initialLimits: {
    maxTotalTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  } = {}
) => {
  const [routingType, setRoutingType] = useState<'manual' | 'round-robin' | 'load-balanced'>(initialType);
  const [routingLimits, setRoutingLimits] = useState<{
    maxTotalTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  }>(initialLimits);

  return {
    routingType,
    setRoutingType,
    routingLimits,
    setRoutingLimits
  };
};
