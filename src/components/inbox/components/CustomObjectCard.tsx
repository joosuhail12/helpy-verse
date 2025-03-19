
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Database, ChevronUp, ChevronDown } from "lucide-react";
import { mockCustomObjects } from '@/mock/customObjects';
import { Skeleton } from "@/components/ui/skeleton";

interface CustomObjectCardProps {
  customerId: string;
  ticketId: string;
  isOpen: boolean;
  onToggle: () => void;
}

const CustomObjectCard = ({ customerId, ticketId, isOpen, onToggle }: CustomObjectCardProps) => {
  // Filter custom objects that are connected with tickets or customers
  const relevantObjects = mockCustomObjects.filter(
    obj => (obj.connectionType === 'ticket' || obj.connectionType === 'customer') && 
           obj.showInCustomerContext
  );

  const isLoading = false;

  if (relevantObjects.length === 0) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="border shadow-sm">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="font-medium">Custom Data</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          ) : (
            <div className="space-y-4">
              {relevantObjects.map((object) => (
                <div key={object.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                  <h4 className="font-medium text-sm mb-2">{object.name}</h4>
                  <div className="grid gap-2">
                    {object.fields.map((field) => (
                      <div key={field.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{field.name}</span>
                        <span className="text-gray-600">-</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CustomObjectCard;
