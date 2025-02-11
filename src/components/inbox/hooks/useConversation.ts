
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getAblyChannel } from '@/utils/ably';
import debounce from 'lodash/debounce';
import type { Message, UserPresence } from '../types';
import type { Ticket } from '@/types/ticket';
import type * as Ably from 'ably';

export const useConversation = (ticket: Ticket) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setMessages([{
      id: ticket.id,
      content: ticket.lastMessage,
      sender: ticket.customer,
      timestamp: ticket.createdAt,
      isCustomer: true,
      readBy: []
    }]);
  }, [ticket]);

  const debouncedStopTyping = useCallback(
    debounce(async (channel) => {
      await channel.presence.update({ isTyping: false });
    }, 1000),
    []
  );

  useEffect(() => {
    const setupRealtime = async () => {
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

        channel.subscribe('new-message', (message) => {
          const newMsg = message.data as Message;
          setMessages(prev => [...prev, newMsg]);
          channel.presence.update({ lastRead: newMsg.id });
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
        if (presenceData) {
          type PresenceMember = {
            clientId: string;
            data?: {
              name?: string;
              lastActive?: string;
              location?: {
                ticketId: string;
                area: string;
              };
            };
          };

          const members = Array.from(presenceData.values()) as PresenceMember[];
          const presentMembers = members.map(member => ({
            userId: member.clientId,
            name: member.data?.name || 'Unknown',
            lastActive: member.data?.lastActive || new Date().toISOString(),
            location: member.data?.location
          } as UserPresence));
          setActiveUsers(presentMembers);
        }

        return () => {
          channel.presence.leave();
          channel.unsubscribe();
          channel.presence.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up realtime:', error);
      }
    };

    setupRealtime();
  }, [ticket.id, toast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const channel = await getAblyChannel(`ticket:${ticket.id}`);
      const newMsg: Message = {
        id: crypto.randomUUID(),
        content: newMessage,
        sender: 'Agent',
        timestamp: new Date().toISOString(),
        isCustomer: false,
        readBy: ['Agent']
      };

      await channel.publish('new-message', newMsg);
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      toast({
        description: "Message sent successfully",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        description: "Failed to send message. Please try again.",
      });
    }
  };

  const handleTyping = async () => {
    try {
      const channel = await getAblyChannel(`ticket:${ticket.id}`);
      await channel.presence.update({ 
        isTyping: true,
        name: 'Agent',
        userId: 'Agent',
        lastActive: new Date().toISOString(),
        location: {
          ticketId: ticket.id,
          area: 'conversation'
        }
      });
      debouncedStopTyping(channel);
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    typingUsers,
    activeUsers,
    handleSendMessage,
    handleTyping
  };
};

