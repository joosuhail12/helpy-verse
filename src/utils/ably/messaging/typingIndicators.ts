
// Basic implementation for typing indicators
export default {
  sendTypingIndicator: async (channelId: string, userData: any) => {
    console.log('User typing in channel', channelId, userData);
    return true;
  }
};
