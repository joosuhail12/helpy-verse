
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Info, AlertTriangle } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { customerService } from '@/api/services/customerService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CustomerHeaderProps {
  customer: string;
  company: string;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  loading?: boolean;
  error?: boolean;
}

const CustomerHeader = ({ customer, company }: CustomerHeaderProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [customerData, setCustomerData] = useState<CustomerData>({
    id: customer,
    name: "Loading...",
    email: "...",
    avatar: "/placeholder.svg",
    loading: true
  });
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customer) return;
      
      try {
        // In a real app, this would fetch from the API
        const response = await customerService.getCustomerDetails(customer);
        const data = response.data;
        
        setCustomerData({
          id: customer,
          name: `${data.firstname} ${data.lastname}`,
          email: data.email,
          avatar: "/placeholder.svg",
          loading: false
        });
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setCustomerData({
          id: customer,
          name: "John Doe", // Fallback to default
          email: "john.doe@example.com",
          avatar: "/placeholder.svg",
          loading: false,
          error: true
        });
        
        toast({
          title: "Error loading customer data",
          description: "Using fallback information",
          variant: "destructive"
        });
      }
    };
    
    fetchCustomerData();
  }, [customer, toast]);

  return (
    <div className="flex-none p-4 border-b">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border transition-transform hover:scale-105">
            <AvatarImage src={customerData.avatar} alt={customerData.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {customerData.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{customerData.name}</h3>
              {customerData.error && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Using fallback data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-xs text-gray-500">{customerData.email}</p>
            {company && <p className="text-xs text-primary font-medium mt-0.5">{company}</p>}
          </div>
        </div>
      </div>
      
      <Tabs 
        defaultValue="details" 
        value={activeTab}
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full bg-muted/50">
          <TabsTrigger 
            value="details"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1.5"
          >
            <Info className="h-3.5 w-3.5" />
            <span>Details</span>
          </TabsTrigger>
          <TabsTrigger 
            value="copilot"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1.5"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Copilot</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-0 px-0 mt-0">
          {/* Details tab content is handled by the parent component */}
        </TabsContent>
        
        <TabsContent value="copilot" className="pt-4 mt-0 space-y-4">
          <div className="rounded-lg border p-4 bg-muted/30 text-sm">
            <h4 className="font-medium mb-2 text-sm">AI Copilot 🤖</h4>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Use AI to analyze customer history, sentiment, and preferences to provide
              personalized support recommendations.
            </p>
          </div>
          
          <div className="h-40 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">AI Copilot features coming soon...</span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerHeader;
