
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Send, Clock, Paperclip, Image as ImageIcon, Reply } from 'lucide-react';
import { getAblyChannel } from '@/utils/ably';
import type { Ticket } from '@/types/ticket';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isCustomer: boolean;
}

interface ConversationPanelProps {
  ticket: Ticket;
  onClose: () => void;
}

const ConversationPanel = ({ ticket, onClose }: ConversationPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  
  // Initialize with the first message from the ticket
  useEffect(() => {
    setMessages([{
      id: ticket.id,
      content: ticket.lastMessage,
      sender: ticket.customer,
      timestamp: ticket.createdAt,
      isCustomer: true
    }]);
  }, [ticket]);

  // Set up real-time messaging
  useEffect(() => {
    const setupRealtime = async () => {
      try {
        const channel = await getAblyChannel(`ticket:${ticket.id}`);
        
        channel.subscribe('new-message', (message) => {
          const newMsg = message.data as Message;
          setMessages(prev => [...prev, newMsg]);
        });

        channel.presence.subscribe('enter', () => {
          toast({
            description: "Someone joined the conversation",
          });
        });

        return () => {
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
        isCustomer: false
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
                <div className="mt-1 flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs gap-1"
                    onClick={() => setNewMessage(`Replying to: "${message.content.substring(0, 50)}..."\n\n`)}
                  >
                    <Reply className="h-3 w-3" />
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="text-sm text-muted-foreground">
              Someone is typing...
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
