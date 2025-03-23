
// Basic implementation for conversation messages
export default {
  getMessageHistory: async (channelId: string) => {
    return [];
  },
  sendMessage: async (channelId: string, message: any) => {
    console.log('Sending message to channel', channelId, message);
    return true;
  }
};
