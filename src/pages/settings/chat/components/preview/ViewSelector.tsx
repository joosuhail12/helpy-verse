
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LayoutDashboard, List, MessageCircle, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  const viewDescriptions = {
    home: 'Initial landing screen',
    messages: 'Message history view',
    conversation: 'Active chat view'
  };

  const getCurrentViewLabel = () => {
    return viewLabels[currentView];
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 shadow-sm hover:shadow">
          <Layers size={14} className="text-purple-500" />
          <span>View: {getCurrentViewLabel()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-1">
          {Object.entries(viewLabels).map(([view, label]) => (
            <div key={view} className="group">
              <Button 
                variant={currentView === view ? 'default' : 'ghost'} 
                size="sm" 
                className="w-full justify-start mb-1"
                onClick={() => onViewChange(view as ChatView)}
              >
                {viewIcons[view as ChatView]} 
                <span>{label}</span>
                {currentView === view && (
                  <Badge variant="outline" className="ml-auto bg-white text-xs font-normal">
                    Active
                  </Badge>
                )}
              </Button>
              <p className={`text-xs pl-7 ${currentView === view ? 'text-gray-500' : 'text-gray-400'} group-hover:text-gray-500 transition-colors mb-2`}>
                {viewDescriptions[view as ChatView]}
              </p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ViewSelector;
