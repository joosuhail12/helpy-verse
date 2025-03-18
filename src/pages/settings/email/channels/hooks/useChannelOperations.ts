
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useToast } from '@/hooks/use-toast';
import { 
  updateChannel,
  deleteChannel,  
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
      // Merge the updated values with any required fields that might be missing
      const mergedChannel = {
        ...updatedChannel,
        // Ensure required fields are present
        channelName: updatedChannel.channelName || channel.channelName,
        senderName: updatedChannel.senderName || channel.senderName,
        email: updatedChannel.email || channel.email,
        type: updatedChannel.type || channel.type,
        allowAgentConversations: 'allowAgentConversations' in updatedChannel 
          ? updatedChannel.allowAgentConversations 
          : channel.allowAgentConversations,
        useAgentNames: 'useAgentNames' in updatedChannel
          ? updatedChannel.useAgentNames
          : channel.useAgentNames,
        useOriginalSender: 'useOriginalSender' in updatedChannel
          ? updatedChannel.useOriginalSender
          : channel.useOriginalSender,
        isActive: 'isActive' in updatedChannel
          ? updatedChannel.isActive
          : channel.isActive,
      };
      
      // Wrap the update data in the expected format
      await dispatch(updateChannel({ 
        id: channel.id, 
        updates: mergedChannel
      })).unwrap();
      
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
