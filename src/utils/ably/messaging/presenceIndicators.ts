
// Basic implementation for presence indicators
export default {
  enterChannel: async (channelId: string, userData: any) => {
    console.log('User entering channel', channelId, userData);
    return true;
  },
  leaveChannel: async (channelId: string, userData: any) => {
    console.log('User leaving channel', channelId, userData);
    return true;
  },
  getPresence: async (channelId: string) => {
    console.log('Getting presence for channel', channelId);
    return [];
  }
};
