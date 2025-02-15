
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Mail, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { EmailChannel } from '@/types/emailChannel';

interface ChannelListProps {
  channels: EmailChannel[];
  onDelete: (id: string) => void;
}

export function ChannelList({ channels, onDelete }: ChannelListProps) {
  const navigate = useNavigate();
  
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

  const getTypeIcon = (type: EmailChannel['type']) => {
    switch (type) {
      case 'sending':
      case 'receiving':
        return <MessageCircle className="h-5 w-5" />;
      case 'both':
        return <Mail className="h-5 w-5" />;
    }
  };

  const handleChannelClick = (id: string) => {
    navigate(`/home/settings/email/channels/${id}`);
  };

  return (
    <div className="divide-y divide-border rounded-md border">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors group cursor-pointer"
          onClick={() => handleChannelClick(channel.id)}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              {getTypeIcon(channel.type)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{channel.channelName}</h3>
                <Badge variant="outline" className="font-normal">
                  {getTypeLabel(channel.type)}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{channel.email}</span>
                <span>•</span>
                <span>Added {format(new Date(channel.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
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
