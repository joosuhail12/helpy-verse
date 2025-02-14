
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, StarOff, Trash2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface EmailChannel {
  id: string;
  email: string;
  type: 'sending' | 'receiving' | 'both';
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

interface ChannelListProps {
  channels: EmailChannel[];
  onVerify: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function ChannelList({ channels, onVerify, onDelete, onSetDefault }: ChannelListProps) {
  const getTypeLabel = (type: EmailChannel['type']) => {
    switch (type) {
      case 'sending':
        return 'Sending Only';
      case 'receiving':
        return 'Receiving Only';
      case 'both':
        return 'Sending & Receiving';
    }
  };

  return (
    <div className="divide-y divide-border">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="flex items-center justify-between p-6 hover:bg-muted/50 group"
        >
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{channel.email}</h3>
                {channel.isDefault && (
                  <Badge variant="secondary" className="text-primary">
                    Default
                  </Badge>
                )}
                <Badge
                  variant={channel.isVerified ? "success" : "destructive"}
                  className="gap-1"
                >
                  {channel.isVerified ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {channel.isVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{getTypeLabel(channel.type)}</span>
                <span>•</span>
                <span>Added {format(new Date(channel.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!channel.isDefault && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSetDefault(channel.id)}
                className="gap-1"
              >
                {channel.isDefault ? (
                  <StarOff className="h-4 w-4" />
                ) : (
                  <Star className="h-4 w-4" />
                )}
                Set as Default
              </Button>
            )}
            {!channel.isVerified && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVerify(channel.id)}
                className="gap-1"
              >
                <CheckCircle2 className="h-4 w-4" />
                Verify
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(channel.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
