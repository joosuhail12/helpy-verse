
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createEmailChannel } from '@/store/slices/emailChannels/emailChannelsSlice';
import { ChannelFormFields } from './ChannelFormFields';
import { useChannelForm } from '../hooks/useChannelForm';
import { Button } from '@/components/ui/button';
import { EmailChannel } from '@/types/emailChannel';

interface AddChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddChannelDialog({ isOpen, onClose }: AddChannelDialogProps) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const {
    name,
    setName,
    senderName,
    setSenderName,
    emailAddress,
    setEmailAddress,
    autoBccMail,
    setAutoBccMail,
    noReplyMail,
    setNoReplyMail,
    selectedEmoji,
    setSelectedEmoji,
    teamId,
    setSelectedTeamId,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
  } = useChannelForm({
    onAddChannel: async (channel) => {
      try {
        await dispatch(createEmailChannel(channel as EmailChannel)).unwrap();
        toast({
          title: "Channel added",
          description: "The email channel has been added successfully.",
        });
        onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Email Channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ChannelFormFields
            channelName={name}
            setChannelName={setName}
            senderName={senderName}
            setSenderName={setSenderName}
            email={emailAddress}
            setEmail={setEmailAddress}
            autoBccEmail={autoBccMail}
            setAutoBccEmail={setAutoBccMail}
            noReplyEmail={noReplyMail}
            setNoReplyEmail={setNoReplyMail}
            selectedEmoji={selectedEmoji}
            setSelectedEmoji={setSelectedEmoji}
            selectedTeamId={teamId}
            setSelectedTeamId={setSelectedTeamId}
            errors={errors as unknown as Record<string, string>}
            touched={touched}
            setFieldTouched={setFieldTouched}
          />
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Channel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
