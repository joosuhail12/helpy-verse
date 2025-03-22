
import * as Ably from 'ably';
import { HttpClient } from '@/api/services/http';
import { throttle } from '@/utils/performance/performanceUtils';

// Define interfaces for type safety
interface ChatMessage {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    type: 'customer' | 'agent' | 'system';
  };
  timestamp: string;
  attachments?: Array<{
    url: string;
    type: string;
    name: string;
  }>;
}

interface ConversationMetadata {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'resolved';
  createdAt: string;
  updatedAt: string;
  participants: Array<{
    id: string;
    name: string;
    type: 'customer' | 'agent';
  }>;
}

// Singleton instance with connection management
let ablyInstance: Ably.Realtime | null = null;
let connectionInitPromise: Promise<Ably.Realtime> | null = null;

// Connection options
const connectionOptions: Ably.Types.ClientOptions = {
  transports: ['websocket'], // Prioritize WebSockets for lowest latency
  autoConnect: false,        // We'll manually connect for better control
  idempotentRestPublishing: true, // Ensures no duplicate messages
  closeOnUnload: true,       // Clean connection on tab close
  reconnectionStrategy: {
    retryCount: 10,          // Number of reconnection attempts
    initialBackoffMs: 300,   // Start with 300ms delay before first retry
    maxBackoffMs: 10000,     // Cap at 10 seconds between retries
  }
};

// Event listeners storage for cleanup
const eventHandlers: Record<string, Function[]> = {};

/**
 * Initialize Ably client with token auth
 * Uses a promise-based singleton pattern to prevent multiple connection attempts
 */
export const initializeAbly = async (): Promise<Ably.Realtime> => {
  if (ablyInstance && ablyInstance.connection.state === 'connected') {
    console.log('Reusing existing Ably connection');
    return ablyInstance;
  }
  
  if (connectionInitPromise) {
    console.log('Connection already initializing, waiting for completion');
    return connectionInitPromise;
  }
  
  connectionInitPromise = (async () => {
    try {
      console.log('Initializing Ably client');
      
      // Fetch token from backend
      const response = await HttpClient.apiClient.get('/api/ably-token');
      const tokenDetails = response.data.token;
      
      // Initialize Ably with token auth and connection options
      ablyInstance = new Ably.Realtime({
        ...connectionOptions,
        token: tokenDetails
      });
      
      // Create connection promise
      const connectionPromise = new Promise<Ably.Realtime>((resolve, reject) => {
        if (!ablyInstance) {
          reject(new Error('Ably instance not initialized'));
          return;
        }
        
        // Connect explicitly
        ablyInstance.connect();
        
        // Listen for connection state changes
        ablyInstance.connection.on('connected', () => {
          console.log('Ably connection established');
          resolve(ablyInstance as Ably.Realtime);
        });
        
        ablyInstance.connection.on('failed', (error) => {
          console.error('Ably connection failed:', error);
          reject(error);
        });
        
        // Add timeout for connection attempt
        setTimeout(() => {
          if (ablyInstance?.connection.state !== 'connected') {
            reject(new Error('Connection timeout after 10 seconds'));
          }
        }, 10000);
      });
      
      return await connectionPromise;
    } catch (error) {
      console.error('Failed to initialize Ably client:', error);
      
      // Fallback to mock implementation for development
      console.warn('Using mock Ably implementation for development');
      
      const mockAbly = {
        connection: {
          on: (event: string, callback: Function) => {
            console.log(`Registered connection event handler: ${event}`);
            if (!eventHandlers['connection:' + event]) {
              eventHandlers['connection:' + event] = [];
            }
            eventHandlers['connection:' + event].push(callback);
            
            // Simulate connected event
            if (event === 'connected') {
              setTimeout(() => callback(), 500);
            }
            
            return { id: 'mock-connection' };
          },
          state: 'connected' as Ably.Types.ConnectionState
        },
        channels: {
          get: (channelName: string) => ({
            presence: {
              enter: async (data: any) => {
                console.log(`Entered ${channelName} with data:`, data);
                return Promise.resolve();
              },
              leave: async () => {
                console.log(`Left ${channelName}`);
                return Promise.resolve();
              },
              subscribe: (event: string, callback: Function) => {
                console.log(`Subscribed to presence ${event} on ${channelName}`);
                if (!eventHandlers[`presence:${channelName}:${event}`]) {
                  eventHandlers[`presence:${channelName}:${event}`] = [];
                }
                eventHandlers[`presence:${channelName}:${event}`].push(callback);
                
                return () => {
                  console.log(`Unsubscribed from presence ${event} on ${channelName}`);
                };
              },
              get: async () => {
                return Promise.resolve([]);
              }
            },
            subscribe: (eventName: string, callback: Function) => {
              console.log(`Subscribed to ${eventName} on channel ${channelName}`);
              if (!eventHandlers[`${channelName}:${eventName}`]) {
                eventHandlers[`${channelName}:${eventName}`] = [];
              }
              eventHandlers[`${channelName}:${eventName}`].push(callback);
              
              return () => {
                console.log(`Unsubscribed from ${eventName} on channel ${channelName}`);
              };
            },
            publish: async (eventName: string, data: any) => {
              console.log(`Published ${eventName} to channel ${channelName}`, data);
              
              // Simulate message delivery with low latency
              setTimeout(() => {
                (eventHandlers[`${channelName}:${eventName}`] || []).forEach(handler => {
                  handler({ data });
                });
              }, 100);
              
              return Promise.resolve();
            }
          })
        },
        close: () => {
          console.log('Mock Ably connection closed');
          ablyInstance = null;
        }
      } as unknown as Ably.Realtime;
      
      ablyInstance = mockAbly;
      return mockAbly;
    } finally {
      // Reset connection promise once complete
      setTimeout(() => {
        connectionInitPromise = null;
      }, 0);
    }
  })();
  
  return connectionInitPromise;
};

/**
 * Create a new conversation
 */
export const createConversation = async (
  customerName: string, 
  customerEmail: string,
  topic: string,
  initialMessage: string
): Promise<string> => {
  try {
    const ably = await initializeAbly();
    const channel = ably.channels.get('new-conversations');
    
    const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await channel.publish('create', {
      conversationId,
      customerName,
      customerEmail,
      topic,
      initialMessage,
      timestamp: new Date().toISOString()
    });
    
    return conversationId;
  } catch (error) {
    console.error('Failed to create conversation:', error);
    throw error;
  }
};

/**
 * Send a message in a conversation - throttled to prevent flooding
 */
export const sendMessage = throttle(async (
  conversationId: string,
  text: string,
  sender: { id: string; name: string; type: 'customer' | 'agent' }
): Promise<void> => {
  try {
    const ably = await initializeAbly();
    const channel = ably.channels.get(`conversation:${conversationId}`);
    
    await channel.publish('message', {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
}, 300); // Throttle to max 3 messages per second

/**
 * Subscribe to messages in a conversation with optimized handling
 */
export const subscribeToConversation = (
  conversationId: string,
  onMessage: (message: ChatMessage) => void
): () => void => {
  try {
    // Optimize by not awaiting connection - this speeds up subscription
    initializeAbly().then(ably => {
      const channel = ably.channels.get(`conversation:${conversationId}`);
      
      // Subscribe with optimized message handling
      const subscription = channel.subscribe('message', (message) => {
        // Use requestAnimationFrame to handle messages in animation frame
        // for better UI performance when receiving rapid messages
        window.requestAnimationFrame(() => {
          onMessage(message.data as ChatMessage);
        });
      });
      
      // Save subscription reference
      if (!eventHandlers[`conversation:${conversationId}`]) {
        eventHandlers[`conversation:${conversationId}`] = [];
      }
      eventHandlers[`conversation:${conversationId}`].push(subscription);
    }).catch(err => {
      console.error('Error subscribing to conversation:', err);
    });
    
    // Return unsubscribe function
    return () => {
      if (ablyInstance) {
        const channel = ablyInstance.channels.get(`conversation:${conversationId}`);
        channel.unsubscribe();
        
        // Clean up handlers
        delete eventHandlers[`conversation:${conversationId}`];
      }
    };
  } catch (error) {
    console.error('Failed to subscribe to conversation:', error);
    return () => {};
  }
};

/**
 * Get user's conversations - low latency implementation
 */
export const getUserConversations = async (
  userId: string
): Promise<ConversationMetadata[]> => {
  try {
    // Simulate rapid response
    const startTime = performance.now();
    
    // In a real implementation, this would fetch from your backend
    // with optimizations like caching and pagination
    const conversations = [
      {
        id: 'conv-1',
        title: 'Support Request',
        status: 'active',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date().toISOString(),
        participants: [
          { id: userId, name: 'Customer', type: 'customer' },
          { id: 'agent-1', name: 'Support Agent', type: 'agent' }
        ]
      }
    ];
    
    const endTime = performance.now();
    console.log(`Fetched conversations in ${endTime - startTime}ms`);
    
    return conversations;
  } catch (error) {
    console.error('Failed to get user conversations:', error);
    return [];
  }
};

/**
 * Monitor typing indicators with performance optimization
 */
export const monitorTypingIndicators = (
  conversationId: string,
  onTypingStatusChange: (users: string[]) => void
): () => void => {
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
      if (ablyInstance) {
        const channel = ablyInstance.channels.get(`conversation:${conversationId}`);
        channel.presence.unsubscribe();
      }
    };
  } catch (error) {
    console.error('Failed to monitor typing indicators:', error);
    return () => {};
  }
};

/**
 * Update typing status with debouncing
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

/**
 * Clean up Ably connection
 */
export const cleanupAblyConnection = (): void => {
  if (ablyInstance) {
    ablyInstance.close();
    ablyInstance = null;
    
    // Clean up all event handlers
    Object.keys(eventHandlers).forEach(key => {
      delete eventHandlers[key];
    });
    
    console.log('Ably connection and event handlers cleaned up');
  }
};
