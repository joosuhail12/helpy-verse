
import React from 'react';
import { Mail } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface DefaultEmailChannelProps {
  email: string;
  isActive: boolean;
  onToggle: (active: boolean) => void;
  disabled?: boolean;
}

export function DefaultEmailChannel({
  email,
  isActive,
  onToggle,
  disabled
}: DefaultEmailChannelProps) {
  return (
    <div className="bg-muted/30 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">Default Email Channel</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{email}</span>
              <Badge variant="outline" className="font-normal">
                System Generated
              </Badge>
            </div>
          </div>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={onToggle}
          disabled={true}
        />
      </div>
    </div>
  );
}
