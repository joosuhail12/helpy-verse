
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createChannel } from '@/store/slices/emailChannels/emailChannelsSlice';
import { ChannelFormFields } from './components/ChannelFormFields';
import { useChannelForm } from './hooks/useChannelForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CreateChannel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    channelName,
    setChannelName,
    senderName,
    setSenderName,
    email,
    setEmail,
    autoBccEmail,
    setAutoBccEmail,
    noReplyEmail,
    setNoReplyEmail,
    selectedIcon,
    setSelectedIcon,
    selectedEmoji,
    setSelectedEmoji,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
  } = useChannelForm({
    onAddChannel: async (channel) => {
      try {
        await dispatch(createChannel(channel)).unwrap();
        toast({
          title: "Channel added",
          description: "The email channel has been added successfully.",
        });
        navigate('/settings/email/channels');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add the email channel.",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/settings/email/channels')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Email Channel</h1>
          <p className="text-muted-foreground">
            Add a new email channel for sending and receiving messages
          </p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <ChannelFormFields
            channelName={channelName}
            setChannelName={setChannelName}
            senderName={senderName}
            setSenderName={setSenderName}
            email={email}
            setEmail={setEmail}
            autoBccEmail={autoBccEmail}
            setAutoBccEmail={setAutoBccEmail}
            noReplyEmail={noReplyEmail}
            setNoReplyEmail={setNoReplyEmail}
            selectedIcon={selectedIcon}
            setSelectedIcon={setSelectedIcon}
            selectedEmoji={selectedEmoji}
            setSelectedEmoji={setSelectedEmoji}
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
          />
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/settings/email/channels')}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Channel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateChannel;
