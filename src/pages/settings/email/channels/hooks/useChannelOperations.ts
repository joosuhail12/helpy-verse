
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useToast } from '@/hooks/use-toast';
import { 
  updateEmailChannel as updateChannel, 
  deleteEmailChannel as deleteChannel,
} from '@/store/slices/emailChannels/emailChannelsSlice';
import type { EmailChannel } from '@/types/emailChannel';

export const useChannelOperations = (channel: EmailChannel) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await dispatch(deleteChannel(channel.id)).unwrap();
      toast({
        title: 'Channel deleted',
        description: 'The email channel has been deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting channel',
        description: error?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (updatedChannel: Partial<EmailChannel>): Promise<boolean> => {
    try {
      const updateData = { 
        id: channel.id,
        ...updatedChannel 
      };
      
      await dispatch(updateChannel(updateData)).unwrap();
      toast({
        title: 'Channel updated',
        description: 'The email channel has been updated successfully.',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error updating channel',
        description: error?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    handleDelete,
    handleUpdate,
  };
};
