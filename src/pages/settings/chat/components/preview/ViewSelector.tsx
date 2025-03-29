
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Home, MessageSquare, List, ChevronDown } from 'lucide-react';
import { ChatView } from '@/types/preview';

interface ViewSelectorProps {
  currentView: ChatView;
  onViewChange: (view: ChatView) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
  // Map views to display names and icons
  const viewDetails = {
    home: { name: 'Home View', icon: <Home className="h-4 w-4 mr-2" /> },
    messages: { name: 'Messages List', icon: <List className="h-4 w-4 mr-2" /> },
    conversation: { name: 'Conversation', icon: <MessageSquare className="h-4 w-4 mr-2" /> }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          {viewDetails[currentView].icon}
          {viewDetails[currentView].name}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => onViewChange('home')} className="flex items-center">
          <Home className="h-4 w-4 mr-2" />
          Home View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewChange('messages')} className="flex items-center">
          <List className="h-4 w-4 mr-2" />
          Messages List
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewChange('conversation')} className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          Conversation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewSelector;
