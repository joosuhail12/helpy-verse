
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { History, ChevronUp, ChevronDown } from "lucide-react";
import CustomerTimeline from './CustomerTimeline';

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
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="border shadow-sm">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <span className="font-medium">Timeline</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4">
          <CustomerTimeline
            events={events}
            isLoading={isLoading}
          />
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default TimelineCard;
