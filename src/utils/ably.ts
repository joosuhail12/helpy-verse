
import * as Ably from 'ably';
import { supabase } from "@/integrations/supabase/client";

let ably: Ably.Realtime | null = null;

export const initAbly = async () => {
  if (ably) return ably;

  try {
    const { data, error } = await supabase.functions.invoke('get-ably-token');
    
    if (error) throw error;
    
    ably = new Ably.Realtime({
      token: data.token
    });

    return ably;
  } catch (error) {
    console.error('Error initializing Ably:', error);
    throw error;
  }
};

export const getAblyChannel = async (channelName: string) => {
  const ablyInstance = await initAbly();
  return ablyInstance.channels.get(channelName);
};
