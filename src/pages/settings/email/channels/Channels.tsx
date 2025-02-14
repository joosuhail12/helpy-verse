
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { AddChannelDialog } from './components/AddChannelDialog';
import { ChannelList } from './components/ChannelList';
import { useToast } from '@/hooks/use-toast';

interface EmailChannel {
  id: string;
  email: string;
  type: 'sending' | 'receiving' | 'both';
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

const mockChannels: EmailChannel[] = [
  {
    id: '1',
    email: 'support@company.com',
    type: 'both',
    isDefault: true,
    isVerified: true,
    createdAt: '2024-03-10T10:00:00Z'
  },
  {
    id: '2',
    email: 'no-reply@company.com',
    type: 'sending',
    isDefault: false,
    isVerified: true,
    createdAt: '2024-03-09T15:30:00Z'
  }
];

const Channels = () => {
  const { toast } = useToast();
  const [channels, setChannels] = useState<EmailChannel[]>(mockChannels);

  const handleAddChannel = (channel: Omit<EmailChannel, 'id' | 'isVerified' | 'createdAt'>) => {
    const newChannel: EmailChannel = {
      ...channel,
      id: Math.random().toString(),
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    setChannels(prev => [...prev, newChannel]);
    toast({
      title: "Channel added",
      description: "The email channel has been added successfully.",
    });
  };

  const handleVerify = (id: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === id ? { ...channel, isVerified: true } : channel
    ));
    toast({
      title: "Verification initiated",
      description: "A verification email has been sent.",
    });
  };

  const handleDelete = (id: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== id));
    toast({
      title: "Channel deleted",
      description: "The email channel has been removed successfully.",
    });
  };

  const handleSetDefault = (id: string) => {
    setChannels(prev => prev.map(channel => ({
      ...channel,
      isDefault: channel.id === id
    })));
    toast({
      title: "Default updated",
      description: "The default email channel has been updated.",
    });
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Email Channels
            </h2>
            <p className="text-muted-foreground">
              Manage your email channels for sending and receiving messages
            </p>
          </div>
          <AddChannelDialog onAddChannel={handleAddChannel} />
        </div>
      </div>

      <Card className="overflow-hidden border-t-2 border-t-primary/10 shadow-sm">
        {channels.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No email channels</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first email channel to start sending and receiving emails
            </p>
            <AddChannelDialog
              className="mt-6"
              variant="outline"
              onAddChannel={handleAddChannel}
            />
          </div>
        ) : (
          <ChannelList
            channels={channels}
            onVerify={handleVerify}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
          />
        )}
      </Card>
    </div>
  );
};

export default Channels;
