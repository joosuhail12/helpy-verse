
import { History, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import CustomerTimeline from './CustomerTimeline';

interface TimelineSectionProps {
  events: Array<{
    id: string;
    type: 'purchase' | 'ticket' | 'message' | 'feedback';
    description: string;
    timestamp: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
  }>;
  isLoading: boolean;
}

const TimelineSection = ({ events, isLoading }: TimelineSectionProps) => {
  return (
    <Collapsible>
      <Card className="border shadow-sm">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium">Timeline</h3>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 pt-0">
            <CustomerTimeline
              events={events}
              isLoading={isLoading}
            />
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default TimelineSection;
