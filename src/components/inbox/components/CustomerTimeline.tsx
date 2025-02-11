
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, ShoppingCart, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface TimelineEvent {
  id: string;
  type: 'purchase' | 'ticket' | 'message' | 'feedback';
  description: string;
  timestamp: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  metadata?: Record<string, any>;
}

interface CustomerTimelineProps {
  events: TimelineEvent[];
  isLoading?: boolean;
}

const CustomerTimeline = ({ events, isLoading }: CustomerTimelineProps) => {
  const getEventIcon = (type: TimelineEvent['type'], sentiment?: TimelineEvent['sentiment']) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case 'ticket':
        return <History className="h-4 w-4 text-blue-500" />;
      case 'message':
        return <MessageCircle className="h-4 w-4 text-purple-500" />;
      case 'feedback':
        return sentiment === 'positive' ? 
          <ThumbsUp className="h-4 w-4 text-green-500" /> :
          <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-muted"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4 p-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative pl-6 pb-4 border-l-2 border-muted last:border-l-transparent"
          >
            <div className="absolute left-[-9px] top-1 bg-background p-1 rounded-full">
              {getEventIcon(event.type, event.sentiment)}
            </div>
            <div className="space-y-1">
              <p className="text-sm">{event.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CustomerTimeline;
