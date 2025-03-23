
// Basic implementation for typing indicators
export default {
  enterChannel: async (channelId: string, userData: any) => {
    console.log('User entering typing channel', channelId, userData);
    return true;
  },
  leaveChannel: async (channelId: string, userData: any) => {
    console.log('User leaving typing channel', channelId, userData);
    return true;
  },
  sendTypingIndicator: async (channelId: string, userData: any) => {
    console.log('User typing in channel', channelId, userData);
    return true;
  }
};
