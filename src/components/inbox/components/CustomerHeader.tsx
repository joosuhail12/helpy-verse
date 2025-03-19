
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, Bot } from "lucide-react";

interface CustomerHeaderProps {
  customer: string;
  company: string;
}

const CustomerHeader = ({ customer, company }: CustomerHeaderProps) => {
  return (
    <div className="p-4 border-b">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="details" className="flex items-center gap-1.5">
            <Info className="h-4 w-4" />
            <span>Details</span>
          </TabsTrigger>
          <TabsTrigger value="copilot" className="flex items-center gap-1.5">
            <Bot className="h-4 w-4" />
            <span>Copilot</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          {/* Details content will be rendered here */}
        </TabsContent>
        
        <TabsContent value="copilot">
          <div className="py-3 text-center text-sm text-gray-500">
            Copilot features will be available soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerHeader;
