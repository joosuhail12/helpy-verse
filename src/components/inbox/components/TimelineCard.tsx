
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, ChevronUp, ChevronDown, MessageSquare, CreditCard, ThumbsUp, FileText, UserCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface TimelineEvent {
  id: string;
  type: 'ticket' | 'purchase' | 'feedback' | 'note' | 'contact_update' | string;
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
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ticket':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'purchase':
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'feedback':
        return <ThumbsUp className="h-4 w-4 text-purple-500" />;
      case 'note':
        return <FileText className="h-4 w-4 text-yellow-500" />;
      case 'contact_update':
        return <UserCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSentimentClass = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-700 bg-green-50 border-green-100';
      case 'negative':
        return 'text-red-700 bg-red-50 border-red-100';
      case 'neutral':
        return 'text-blue-700 bg-blue-50 border-blue-100';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-100';
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="border shadow-sm">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-medium">Customer Timeline</span>
              {events.length > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {events.length}
                </span>
              )}
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-md border ${getSentimentClass(event.sentiment)}`}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">{getEventIcon(event.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-3 text-center">No timeline events available</p>
          )}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default TimelineCard;
