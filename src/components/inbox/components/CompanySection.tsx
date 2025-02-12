
import { Building2, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Ticket } from "@/types/ticket";
import CompanyContent from "./content/CompanyContent";

interface CompanySectionProps {
  ticket: Ticket;
}

const CompanySection = ({ ticket }: CompanySectionProps) => {
  return (
    <Collapsible>
      <Card className="border shadow-sm">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium">Company</h3>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CompanyContent company={ticket.company} />
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CompanySection;
