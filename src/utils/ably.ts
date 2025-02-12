
import * as Ably from 'ably';
import { supabase } from "@/integrations/supabase/client";

let ably: Ably.Realtime | null = null;
let tokenRetryCount = 0;
const MAX_RETRIES = 3;

export const initAbly = async () => {
  if (ably?.connection.state === 'connected') return ably;
  
  try {
    if (tokenRetryCount >= MAX_RETRIES) {
      console.error('Max retry attempts reached for Ably token');
      return null;
    }

    const { data, error } = await supabase.functions.invoke('get-ably-token');
    
    if (error) {
      console.error('Error fetching Ably token:', error);
      tokenRetryCount++;
      return null;
    }
    
    if (ably) {
      await ably.close();
    }

    ably = new Ably.Realtime({
      token: data.token,
      disconnectedRetryTimeout: 5000,
      suspendedRetryTimeout: 10000,
    });

    // Reset retry count on successful connection
    tokenRetryCount = 0;
    
    return ably;
  } catch (error) {
    console.error('Error initializing Ably:', error);
    tokenRetryCount++;
    return null;
  }
};

export const getAblyChannel = async (channelName: string) => {
  const ablyInstance = await initAbly();
  if (!ablyInstance) {
    console.error('Failed to initialize Ably');
    return null;
  }
  return ablyInstance.channels.get(channelName);
};
