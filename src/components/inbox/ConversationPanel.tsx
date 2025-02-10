
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Send, Clock } from 'lucide-react';
import type { Ticket } from '@/types/ticket';

interface ConversationPanelProps {
  ticket: Ticket;
  onClose: () => void;
}

const ConversationPanel = ({ ticket, onClose }: ConversationPanelProps) => {
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
          {/* First message (from customer) */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <span className="text-xs">{ticket.customer[0]}</span>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{ticket.customer}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="mt-1 text-sm bg-secondary/20 rounded-lg p-3">
                {ticket.lastMessage}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Reply Area */}
      <div className="border-t p-4 bg-white">
        <Textarea
          placeholder="Type your reply..."
          className="min-h-[100px] resize-none mb-3"
        />
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Press Enter to send, Shift + Enter for new line
          </div>
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Send Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPanel;
