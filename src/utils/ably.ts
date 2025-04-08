import * as Ably from 'ably';
import { ChatClient, AllFeaturesEnabled, LogLevel } from '@ably/chat';

let ably: any = null;
let chatInstance: ChatClient | null = null;

export const initAbly = async () => {
  if (ably) return ably;

  try {
    // Initialize Ably with the API key from environment variables
    const apiKey = import.meta.env.VITE_ABLY_API_KEY;

    if (!apiKey) {
      console.error('Ably API key not found in environment variables');
      throw new Error('Ably API key not found. Add VITE_ABLY_API_KEY to your .env file');
    }
    // SECURITY IMPLEMENTATION FOR PRODUCTION:
    // Replace direct API key usage with token auth:
    // ably = new Ably.Realtime({
    //   authUrl: '/api/ably/auth', // Server endpoint that generates tokens
    //   clientId: uniqueId,
    //   echoMessages: false
    // });
    // 
    // On your server:
    // app.post('/api/ably/auth', (req, res) => {
    //   const tokenParams = {
    //     clientId: req.body.clientId,
    //     capability: {
    //       "ticket:*": ["subscribe", "publish", "presence"], // Restrict to needed permissions
    //     },
    //     ttl: 3600 * 1000 // Expires after 1 hour
    //   };
    //   const rest = new Ably.Rest({ key: process.env.ABLY_API_KEY });
    //   rest.auth.createTokenRequest(tokenParams, (err, tokenRequest) => {
    //     if (err) return res.status(500).send('Error');
    //     res.json(tokenRequest);
    //   });
    // });

    console.log('Initializing Ably with client ID');

    // Create Ably client with API key
    ably = new Ably.Realtime({
      key: apiKey,
      clientId: 'agent-' + Math.random().toString(36).substring(2, 15),
      echoMessages: false
    });

    // Wait for connection to be established
    await new Promise((resolve, reject) => {
      const connectionTimeout = setTimeout(() => {
        reject(new Error('Connection timeout after 10 seconds'));
      }, 10000);

      ably.connection.once('connected', () => {
        clearTimeout(connectionTimeout);
        console.log('Ably connection established successfully');
        resolve(true);
      });

      ably.connection.once('failed', (err: any) => {
        clearTimeout(connectionTimeout);
        reject(new Error(`Ably connection failed: ${err?.message || 'Unknown error'}`));
      });
    });

    return ably;
  } catch (error) {
    console.error('Error initializing Ably:', error);
    ably = null; // Reset the instance on error
    throw error;
  }
};

export const getAblyChannel = async (channelName: string) => {
  const ablyInstance = await initAbly();
  return ablyInstance.channels.get(channelName);
};

export const getAblyChatClient = async () => {
  if (chatInstance) return chatInstance;

  const ablyInstance = await initAbly();
  chatInstance = new ChatClient(ablyInstance, {
    logLevel: LogLevel.Error
  });
  return chatInstance;
};

export const getAblyChatRoom = async (roomId: string, options = AllFeaturesEnabled) => {
  const chatClient = await getAblyChatClient();
  return chatClient.rooms.get(roomId, options);
};
