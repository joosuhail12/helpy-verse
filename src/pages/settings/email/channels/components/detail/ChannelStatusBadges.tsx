
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ChannelStatusBadgesProps {
  isDefault?: boolean;
}

export const ChannelStatusBadges: React.FC<ChannelStatusBadgesProps> = ({
  isDefault,
}) => {
  return (
    <>
      {isDefault && (
        <Badge variant="outline" className="ml-2">
          Default
        </Badge>
      )}
    </>
  );
};
