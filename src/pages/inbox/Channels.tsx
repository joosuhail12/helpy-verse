
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Ticket } from '@/types/ticket';
import TicketList from '@/components/inbox/TicketList';

const Channels = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [channelName, setChannelName] = useState('');
  
  useEffect(() => {
    // This would be replaced with a real API call
    setIsLoading(true);
    setChannelName(`Channel ${channelId}`);
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [channelId]);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-none p-4 border-b bg-white">
        <h1 className="text-xl font-semibold">{channelName}</h1>
        <p className="text-sm text-gray-500">View tickets from this channel</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <TicketList 
          tickets={tickets} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default Channels;
