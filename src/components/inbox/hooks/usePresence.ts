
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getAblyChannel } from '@/utils/ably';
import type { UserPresence, Message } from '../types';
import type { Ticket } from '@/types/ticket';
import type * as Ably from 'ably';

export const usePresence = (ticket: Ticket, setMessages: (updater: (prev: Message[]) => Message[]) => void) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const setupPresence = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const channel = await getAblyChannel(`ticket:${ticket.id}`);

        await channel.presence.enter({
          userId: 'Agent',
          name: 'Agent',
          lastActive: new Date().toISOString(),
          location: {
            ticketId: ticket.id,
            area: 'conversation'
          }
        });

        channel.presence.subscribe('enter', (member) => {
          toast({
            description: `${member.data.name} joined the conversation`,
          });
          setActiveUsers(prev => [...prev, member.data as UserPresence]);
        });

        channel.presence.subscribe('leave', (member) => {
          toast({
            description: `${member.data.name} left the conversation`,
          });
          setActiveUsers(prev => prev.filter(user => user.userId !== member.data.userId));
        });

        channel.presence.subscribe('update', (member) => {
          if (member.data?.isTyping) {
            setTypingUsers(prev => [...new Set([...prev, member.data.name])]);
          } else {
            setTypingUsers(prev => prev.filter(user => user !== member.data.name));
          }

          if (member.data?.lastRead) {
            setMessages(prev => prev.map(msg => ({
              ...msg,
              readBy: [...(msg.readBy || []), member.data.userId]
            })));
          }

          if (member.data?.location) {
            setActiveUsers(prev => prev.map(user =>
              user.userId === member.data.userId
                ? { ...user, location: member.data.location }
                : user
            ));
          }
        });
        const presenceData = await channel.presence.get();

        if (presenceData && Array.isArray(presenceData)) {
          const presentMembers = presenceData.map(member => ({
            userId: member.clientId,
            name: member.data?.name || 'Unknown',
            lastActive: member.data?.lastActive || new Date().toISOString(),
            location: member.data?.location
          } as UserPresence));
          setActiveUsers(presentMembers);
        }

        setIsLoading(false);

        return () => {
          channel.presence.leave();
          channel.presence.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up presence:', error);
        setError('Failed to connect to the conversation. Please try again.');
        setIsLoading(false);
      }
    };

    setupPresence();
  }, [ticket.id, toast, setMessages]);

  return { typingUsers, activeUsers, isLoading, error };
};
