
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Ticket } from '@/types/ticket';

interface ConversationPanelProps {
  ticket: Ticket;
  onClose: () => void;
}

const ConversationPanel = ({ ticket, onClose }: ConversationPanelProps) => {
  return (
    <div className="h-full flex flex-col border-l bg-white">
      <div className="border-b p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">{ticket.subject}</h2>
          <p className="text-sm text-gray-500">
            {ticket.customer} • {ticket.company}
          </p>
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
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-sm text-gray-900">{ticket.lastMessage}</p>
            <div className="mt-1 text-xs text-gray-500">
              {new Date(ticket.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t p-4">
        <textarea
          className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type your message..."
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <Button>Send Message</Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPanel;
