
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createChannel } from '@/store/slices/emailChannels/emailChannelsSlice';
import { ChannelFormFields } from './components/ChannelFormFields';
import { useChannelForm } from './hooks/useChannelForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

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
    selectedEmoji,
    setSelectedEmoji,
    selectedTeamId,
    setSelectedTeamId,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
    isSubmitting,
  } = useChannelForm({
    onAddChannel: async (channel) => {
      try {
        // Ensure required properties are present for the Redux action
        const completeChannel = {
          ...channel,
          // Add these fields to make it compatible with the expected type
          name: channel.channelName,
          domainStatus: 'pending' as const, // use correct literal type
        };
        
        const result = await dispatch(createChannel(completeChannel)).unwrap();
        toast({
          title: "Channel created successfully",
          description: `${result.channelName} has been created with ${result.email} as the sender.`,
          duration: 5000,
        });
        navigate('/home/settings/email/channels');
      } catch (error: any) {
        toast({
          title: "Failed to create channel",
          description: error?.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleBack = () => {
    navigate('/home/settings/email/channels');
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
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
            selectedEmoji={selectedEmoji}
            setSelectedEmoji={setSelectedEmoji}
            selectedTeamId={selectedTeamId}
            setSelectedTeamId={setSelectedTeamId}
            errors={errors as unknown as Record<string, string>}
            touched={touched}
            setFieldTouched={setFieldTouched}
          />
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Channel'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateChannel;
