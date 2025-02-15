
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  deleteChannel, 
  setDefaultChannel, 
  verifyChannel,
  updateChannel,
} from '@/store/slices/emailChannels/emailChannelsSlice';
import type { EmailChannel } from '@/types/emailChannel';

export const useChannelOperations = (channel: EmailChannel) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(deleteChannel(channel.id)).unwrap();
      toast({
        title: "Channel deleted",
        description: "The email channel has been successfully deleted.",
      });
      navigate('/home/settings/email/channels');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the channel.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async () => {
    try {
      await dispatch(setDefaultChannel(channel.id)).unwrap();
      toast({
        title: "Default channel updated",
        description: "This channel has been set as the default channel.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set as default channel.",
        variant: "destructive",
      });
    }
  };

  const handleVerify = async () => {
    try {
      await dispatch(verifyChannel(channel.id)).unwrap();
      toast({
        title: "Verification initiated",
        description: "A verification email has been sent to your address.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate verification.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (updatedChannel: Partial<EmailChannel>) => {
    try {
      await dispatch(updateChannel({
        ...updatedChannel,
        id: channel.id,
      })).unwrap();
      toast({
        title: "Channel updated",
        description: "The email channel has been successfully updated.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the channel.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleDelete,
    handleSetDefault,
    handleVerify,
    handleUpdate,
  };
};
