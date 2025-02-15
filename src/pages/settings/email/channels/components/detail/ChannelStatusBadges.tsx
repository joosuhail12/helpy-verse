
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ChannelStatusBadgesProps {
  isDefault: boolean;
  isVerified: boolean;
}

export const ChannelStatusBadges: React.FC<ChannelStatusBadgesProps> = ({ isDefault, isVerified }) => {
  return (
    <div className="flex gap-2">
      {isDefault && (
        <Badge variant="secondary" className="text-primary">
          Default
        </Badge>
      )}
      <Badge
        variant={isVerified ? "default" : "destructive"}
        className="gap-1"
      >
        {isVerified ? (
          <CheckCircle2 className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        {isVerified ? "Verified" : "Unverified"}
      </Badge>
    </div>
  );
};
