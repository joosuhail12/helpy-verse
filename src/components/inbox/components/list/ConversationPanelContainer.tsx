
import { useState } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Ticket } from '@/types/ticket';

interface ConversationPanelContainerProps {
  selectedTicket: Ticket;
  onClose: () => void;
}

const ConversationPanelContainer = ({ selectedTicket, onClose }: ConversationPanelContainerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demonstration
  setTimeout(() => {
    setIsLoading(false);
  }, 800);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none p-4 border-b bg-white">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onClose} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h2 className="text-lg font-semibold">{selectedTicket.subject}</h2>
            <p className="text-sm text-gray-500">
              {selectedTicket.customer} • {selectedTicket.company}
            </p>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-gray-500">Loading conversation...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-4 overflow-auto bg-gray-50">
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{selectedTicket.customer}</span>
                <span className="text-xs text-gray-500">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm">{selectedTicket.lastMessage}</p>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg shadow-sm ml-auto max-w-3xl">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Agent Response</span>
                <span className="text-xs text-gray-500">{new Date().toLocaleString()}</span>
              </div>
              <p className="text-sm">Thank you for reaching out. I'm looking into this issue for you and will get back to you shortly.</p>
            </div>

            {/* Placeholder for conversation */}
            <p className="text-center text-gray-500 text-sm py-4">
              This is a placeholder for the conversation. <br/>
              The actual conversation component will be implemented separately.
            </p>
          </div>
        </div>
      )}
      
      <div className="flex-none p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPanelContainer;
