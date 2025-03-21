
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { History, ChevronUp, ChevronDown, ShoppingBag, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TimelineEvent {
  id: string;
  type: 'ticket' | 'purchase' | 'feedback';
  description: string;
  timestamp: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface TimelineCardProps {
  events: TimelineEvent[];
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

const TimelineCard = ({ events, isLoading, isOpen, onToggle }: TimelineCardProps) => {
  const getEventIcon = (type: TimelineEvent['type'], sentiment?: TimelineEvent['sentiment']) => {
    switch (type) {
      case 'ticket':
        return <MessageSquare className="h-3.5 w-3.5 text-purple-500" />;
      case 'purchase':
        return <ShoppingBag className="h-3.5 w-3.5 text-green-500" />;
      case 'feedback':
        if (sentiment === 'positive') {
          return <ThumbsUp className="h-3.5 w-3.5 text-blue-500" />;
        } else if (sentiment === 'negative') {
          return <ThumbsDown className="h-3.5 w-3.5 text-red-500" />;
        }
        return <MessageSquare className="h-3.5 w-3.5 text-gray-500" />;
      default:
        return <History className="h-3.5 w-3.5 text-gray-500" />;
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="group">
      <Card className="border shadow-sm hover:shadow-md transition-all duration-200">
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-t-lg group-data-[state=closed]:rounded-lg"
          >
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <span className="font-medium">Timeline</span>
            </div>
            {isOpen ? 
              <ChevronUp className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" /> : 
              <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-1/2 h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative pl-5 space-y-4 pt-1 after:absolute after:top-0 after:bottom-0 after:left-[0.6rem] after:w-[1px] after:bg-gray-200">
              {events.map((event) => (
                <div key={event.id} className="relative">
                  <div className="absolute left-[-0.85rem] top-0.5 z-10 bg-white rounded-full p-0.5">
                    {getEventIcon(event.type, event.sentiment)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700">{event.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              
              <Button variant="ghost" className="w-full text-xs text-primary hover:text-primary/90 hover:bg-primary/5 mt-2">
                View Full History
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default TimelineCard;
