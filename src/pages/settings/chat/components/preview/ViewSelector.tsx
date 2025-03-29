
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { LayoutDashboard, List, MessageCircle } from 'lucide-react';

type ChatView = 'home' | 'messages' | 'conversation';

interface ViewSelectorProps {
  currentView: ChatView;
  onViewChange: (view: ChatView) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          {currentView === 'home' ? (
            <><LayoutDashboard size={14} /> Home</>
          ) : currentView === 'messages' ? (
            <><List size={14} /> Messages</>
          ) : (
            <><MessageCircle size={14} /> Conversation</>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-3">
        <div className="space-y-2">
          <Label>Current View</Label>
          <div className="space-y-1">
            <Button 
              variant={currentView === 'home' ? 'default' : 'outline'} 
              size="sm" 
              className="w-full justify-start"
              onClick={() => onViewChange('home')}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" /> Home
            </Button>
            <Button 
              variant={currentView === 'messages' ? 'default' : 'outline'} 
              size="sm" 
              className="w-full justify-start"
              onClick={() => onViewChange('messages')}
            >
              <List className="h-4 w-4 mr-2" /> Messages
            </Button>
            <Button 
              variant={currentView === 'conversation' ? 'default' : 'outline'} 
              size="sm" 
              className="w-full justify-start"
              onClick={() => onViewChange('conversation')}
            >
              <MessageCircle className="h-4 w-4 mr-2" /> Conversation
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ViewSelector;
