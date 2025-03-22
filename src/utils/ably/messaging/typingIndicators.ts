
import { initializeAbly } from '../connection/connectionManager';
import { throttle } from '@/utils/performance/performanceUtils';

/**
 * Monitor typing indicators with performance optimization
 */
export const monitorTypingIndicators = (
  conversationId: string,
  onTypingStatusChange: (users: string[]) => void
): (() => void) => {
  try {
    initializeAbly().then(ably => {
      const channel = ably.channels.get(`conversation:${conversationId}`);
      
      channel.presence.subscribe('update', (member) => {
        if (member.data?.isTyping !== undefined) {
          // Get all current presence data to determine who's typing
          channel.presence.get((err, members) => {
            if (err) {
              console.error('Error getting presence data:', err);
              return;
            }
            
            // Extract typing users
            const typingUsers = members
              .filter(m => m.data?.isTyping)
              .map(m => m.data.name || 'Unknown');
            
            onTypingStatusChange(typingUsers);
          });
        }
      });
    }).catch(err => {
      console.error('Error monitoring typing indicators:', err);
    });
    
    return () => {
      initializeAbly().then(ably => {
        const channel = ably.channels.get(`conversation:${conversationId}`);
        channel.presence.unsubscribe();
      }).catch(err => {
        console.error('Error cleaning up typing indicators:', err);
      });
    };
  } catch (error) {
    console.error('Failed to monitor typing indicators:', error);
    return () => {};
  }
};

/**
 * Update typing status with throttling
 */
export const updateTypingStatus = throttle(async (
  conversationId: string,
  userId: string,
  userName: string,
  isTyping: boolean
): Promise<void> => {
  try {
    const ably = await initializeAbly();
    const channel = ably.channels.get(`conversation:${conversationId}`);
    
    await channel.presence.enter({
      userId,
      name: userName,
      isTyping,
      lastActive: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to update typing status:', error);
  }
}, 500); // Throttle to 2 updates per second
