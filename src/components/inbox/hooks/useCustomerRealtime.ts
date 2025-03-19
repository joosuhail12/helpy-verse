
import { useState, useEffect } from 'react';
import { getAblyChannel } from '@/utils/ably';
import { useToast } from '@/hooks/use-toast';

export interface CustomerUpdate {
  id: string;
  type: 'contact_update' | 'company_update' | 'activity' | 'sentiment';
  data: any;
  timestamp: string;
}

export const useCustomerRealtime = (customerId: string, companyId?: string) => {
  const [updates, setUpdates] = useState<CustomerUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const setupRealtime = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Subscribe to customer channel
        const customerChannel = await getAblyChannel(`customer:${customerId}`);
        
        const handleUpdate = (message: any) => {
          const update = message.data as CustomerUpdate;
          console.log('Received customer update:', update);
          
          // Add update to list
          setUpdates(prev => [update, ...prev]);
          
          // Show toast notification for important updates
          if (update.type === 'contact_update') {
            toast({
              description: `Customer information updated`,
            });
          } else if (update.type === 'activity') {
            toast({
              description: `New customer activity: ${update.data.description}`,
            });
          }
        };
        
        // Subscribe to updates
        customerChannel.subscribe('update', handleUpdate);
        
        // Also subscribe to company channel if available
        let companyChannel;
        if (companyId) {
          companyChannel = await getAblyChannel(`company:${companyId}`);
          companyChannel.subscribe('update', handleUpdate);
        }
        
        setLoading(false);
        
        // Clean up subscriptions on unmount
        return () => {
          customerChannel.unsubscribe('update');
          if (companyChannel) {
            companyChannel.unsubscribe('update');
          }
        };
      } catch (error) {
        console.error('Error setting up customer realtime:', error);
        setError('Failed to connect to realtime updates');
        setLoading(false);
      }
    };
    
    if (customerId) {
      setupRealtime();
    }
  }, [customerId, companyId, toast]);
  
  // Function to publish an update (for testing or manual updates)
  const publishUpdate = async (update: Omit<CustomerUpdate, 'timestamp'>) => {
    try {
      const channel = await getAblyChannel(`customer:${customerId}`);
      const fullUpdate: CustomerUpdate = {
        ...update,
        timestamp: new Date().toISOString()
      };
      await channel.publish('update', fullUpdate);
      return true;
    } catch (error) {
      console.error('Error publishing update:', error);
      return false;
    }
  };
  
  return { updates, loading, error, publishUpdate };
};
