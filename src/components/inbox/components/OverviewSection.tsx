
import { History, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Ticket } from "@/types/ticket";
import OverviewContent from "./content/OverviewContent";

interface OverviewSectionProps {
  ticket: Ticket;
}

const OverviewSection = ({ ticket }: OverviewSectionProps) => {
  return (
    <Collapsible defaultOpen>
      <Card className="border shadow-sm">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium">Overview</h3>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <OverviewContent ticket={ticket} />
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default OverviewSection;
