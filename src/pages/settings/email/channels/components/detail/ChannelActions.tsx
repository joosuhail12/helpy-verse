
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, CheckCircle2, Trash2 } from 'lucide-react';

interface ChannelActionsProps {
  isDefault: boolean;
  isVerified: boolean;
  onSetDefault: () => void;
  onVerify: () => void;
  onDelete: () => void;
}

export const ChannelActions: React.FC<ChannelActionsProps> = ({
  isDefault,
  isVerified,
  onSetDefault,
  onVerify,
  onDelete,
}) => {
  return (
    <div className="flex gap-2">
      {!isDefault && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSetDefault}
          className="gap-1"
        >
          <Star className="h-4 w-4" />
          Set as Default
        </Button>
      )}
      {!isVerified && (
        <Button
          variant="outline"
          size="sm"
          onClick={onVerify}
          className="gap-1"
        >
          <CheckCircle2 className="h-4 w-4" />
          Verify
        </Button>
      )}
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="gap-1"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};
