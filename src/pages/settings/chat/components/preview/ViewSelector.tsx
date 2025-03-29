
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LayoutDashboard, List, MessageCircle } from 'lucide-react';

type ChatView = 'home' | 'messages' | 'conversation';

interface ViewSelectorProps {
  currentView: ChatView;
  onViewChange: (view: ChatView) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
  const viewIcons = {
    home: <LayoutDashboard className="h-4 w-4 mr-2" />,
    messages: <List className="h-4 w-4 mr-2" />,
    conversation: <MessageCircle className="h-4 w-4 mr-2" />
  };
  
  const viewLabels = {
    home: 'Home',
    messages: 'Messages',
    conversation: 'Conversation'
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          {viewIcons[currentView]}
          {viewLabels[currentView]}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-3">
        <div className="space-y-1">
          {Object.entries(viewLabels).map(([view, label]) => (
            <Button 
              key={view}
              variant={currentView === view ? 'default' : 'outline'} 
              size="sm" 
              className="w-full justify-start"
              onClick={() => onViewChange(view as ChatView)}
            >
              {viewIcons[view as ChatView]} {label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ViewSelector;
