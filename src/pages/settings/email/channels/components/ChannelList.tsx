
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Trash2, 
  Mail, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  LayoutGrid, 
  List 
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { EmailChannel } from '@/types/emailChannel';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ChannelListProps {
  channels: EmailChannel[];
  selectedChannels: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectChannel: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export function ChannelList({ 
  channels, 
  selectedChannels,
  onSelectAll,
  onSelectChannel,
  onDelete, 
  onToggleStatus 
}: ChannelListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const getTypeLabel = (type: EmailChannel['type']) => {
    switch (type) {
      case 'outgoing':
        return 'Sending Only';
      case 'incoming':
        return 'Receiving Only';
      case 'both':
        return 'Sending & Receiving';
    }
  };

  const getTypeIcon = (type: EmailChannel['type']) => {
    switch (type) {
      case 'outgoing':
      case 'incoming':
        return <MessageCircle className="h-5 w-5" />;
      case 'both':
        return <Mail className="h-5 w-5" />;
    }
  };

  const handleChannelClick = (id: string) => {
    navigate(`/home/settings/email/channels/${id}`);
  };

  const handleStatusToggle = async (id: string, isActive: boolean) => {
    await onToggleStatus(id, isActive);
    toast({
      title: isActive ? "Channel activated" : "Channel deactivated",
      description: `The email channel has been ${isActive ? 'activated' : 'deactivated'} successfully.`,
    });
  };

  const StatusIndicator = ({ isActive }: { isActive: boolean }) => (
    <div className="flex items-center gap-2">
      {isActive ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <span className={isActive ? 'text-green-600' : 'text-red-600'}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={selectedChannels.length === channels.length}
            onCheckedChange={(checked) => onSelectAll(!!checked)}
          />
          <span className="text-sm font-medium">Select all channels</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          className="gap-2"
        >
          {viewMode === 'list' ? (
            <><LayoutGrid className="h-4 w-4" /> Grid View</>
          ) : (
            <><List className="h-4 w-4" /> List View</>
          )}
        </Button>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`
              bg-white border rounded-lg transition-colors
              ${viewMode === 'list' ? 'hover:bg-muted/50' : 'hover:border-primary/50'}
              ${selectedChannels.includes(channel.id) ? 'border-primary' : 'border-border'}
            `}
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedChannels.includes(channel.id)}
                  onCheckedChange={(checked) => onSelectChannel(channel.id, !!checked)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div 
                  className="flex-1 cursor-pointer"
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
                      <StatusIndicator isActive={channel.isActive} />
                    </div>
                  </div>
                </div>
                <div 
                  className="flex items-center gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Switch
                    checked={channel.isActive}
                    onCheckedChange={(checked) => handleStatusToggle(channel.id, checked)}
                  />
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
