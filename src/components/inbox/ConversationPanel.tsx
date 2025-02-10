
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Send, Clock, Paperclip, Image as ImageIcon, Reply, Check, CheckCheck } from 'lucide-react';
import { getAblyChannel } from '@/utils/ably';
import type { Ticket } from '@/types/ticket';
import { useToast } from "@/hooks/use-toast";
import debounce from 'lodash/debounce';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isCustomer: boolean;
  readBy?: string[];
}

interface ConversationPanelProps {
  ticket: Ticket;
  onClose: () => void;
}

const ConversationPanel = ({ ticket, onClose }: ConversationPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Initialize with the first message from the ticket
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

  // Debounced function to stop typing indicator
  const debouncedStopTyping = useCallback(
    debounce(async (channel) => {
      await channel.presence.update({ isTyping: false });
    }, 1000),
    []
  );

  // Set up real-time messaging
  useEffect(() => {
    const setupRealtime = async () => {
      try {
        const channel = await getAblyChannel(`ticket:${ticket.id}`);
        
        // Subscribe to new messages
        channel.subscribe('new-message', (message) => {
          const newMsg = message.data as Message;
          setMessages(prev => [...prev, newMsg]);
          
          // Mark message as read
          channel.presence.update({ lastRead: newMsg.id });
        });

        // Handle presence for typing indicators and read receipts
        channel.presence.subscribe('enter', (member) => {
          toast({
            description: `${member.clientId} joined the conversation`,
          });
        });

        channel.presence.subscribe('update', (member) => {
          // Update typing indicators
          if (member.data?.isTyping) {
            setTypingUsers(prev => [...new Set([...prev, member.clientId])]);
          } else {
            setTypingUsers(prev => prev.filter(user => user !== member.clientId));
          }

          // Update read receipts
          if (member.data?.lastRead) {
            setMessages(prev => prev.map(msg => ({
              ...msg,
              readBy: [...(msg.readBy || []), member.clientId]
            })));
          }
        });

        // Clean up on unmount
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
      // Update typing indicator
      try {
        const channel = await getAblyChannel(`ticket:${ticket.id}`);
        await channel.presence.update({ isTyping: true });
        debouncedStopTyping(channel);
      } catch (error) {
        console.error('Error updating typing status:', error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg truncate">{ticket.subject}</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
              #{ticket.id}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Avatar className="h-5 w-5">
              <span className="text-xs">{ticket.customer[0]}</span>
            </Avatar>
            <p className="text-sm text-muted-foreground">
              {ticket.customer} • {ticket.company}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <span className="text-xs">
                  {message.isCustomer ? ticket.customer[0] : 'A'}
                </span>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {message.isCustomer ? ticket.customer : 'Agent'}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 text-sm bg-secondary/20 rounded-lg p-3">
                  {message.content}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs gap-1"
                    onClick={() => setNewMessage(`Replying to: "${message.content.substring(0, 50)}..."\n\n`)}
                  >
                    <Reply className="h-3 w-3" />
                    Reply
                  </Button>
                  {!message.isCustomer && (
                    <span className="text-xs text-muted-foreground">
                      {message.readBy && message.readBy.length > 1 ? (
                        <CheckCheck className="h-3 w-3 inline" />
                      ) : (
                        <Check className="h-3 w-3 inline" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {typingUsers.length > 0 && (
            <div className="text-sm text-muted-foreground animate-pulse">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Reply Area */}
      <div className="border-t p-4 bg-white">
        <Textarea
          placeholder="Type your reply..."
          className="min-h-[100px] resize-none mb-3"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground">
              Press Enter to send, Shift + Enter for new line
            </div>
            <Button className="gap-2" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
              Send Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPanel;
