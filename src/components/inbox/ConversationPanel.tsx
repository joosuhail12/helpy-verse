
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { getAblyChannel } from '@/utils/ably';
import debounce from 'lodash/debounce';
import type { Message, ConversationPanelProps, UserPresence } from './types';
import ConversationHeader from './ConversationHeader';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import * as Ably from 'ably';

const ConversationPanel = ({ ticket, onClose }: ConversationPanelProps) => {
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
        
        // Set initial presence
        await channel.presence.enter({
          userId: 'Agent',
          name: 'Agent',
          lastActive: new Date().toISOString()
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
        });

        // Get current presence state
        try {
          const presenceMessages = await channel.presence.get() as Ably.Types.PresenceMessage[];
          const presenceArray = presenceMessages ? Array.from(presenceMessages) : [];
          if (presenceArray.length > 0) {
            setActiveUsers(presenceArray.map(member => member.data as UserPresence));
          }
        } catch (error) {
          console.error('Error getting presence members:', error);
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

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      try {
        const channel = await getAblyChannel(`ticket:${ticket.id}`);
        await channel.presence.update({ 
          isTyping: true,
          name: 'Agent',
          userId: 'Agent',
          lastActive: new Date().toISOString()
        });
        debouncedStopTyping(channel);
      } catch (error) {
        console.error('Error updating typing status:', error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <ConversationHeader 
        ticket={ticket} 
        onClose={onClose} 
        activeUsers={activeUsers}
      />
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              ticket={ticket}
              onReply={setNewMessage}
            />
          ))}
          {typingUsers.length > 0 && (
            <div className="text-sm text-muted-foreground animate-pulse">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}
        </div>
      </ScrollArea>

      <MessageInput
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onKeyPress={handleKeyPress}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ConversationPanel;

