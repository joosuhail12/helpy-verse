
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Building2, ChevronUp, ChevronDown, Globe, Users, DollarSign, Calendar } from "lucide-react";

interface CompanyInfoCardProps {
  company: string;
  isOpen: boolean;
  onToggle: () => void;
}

const CompanyInfoCard = ({ company, isOpen, onToggle }: CompanyInfoCardProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="border shadow-sm">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="font-medium">Company Information</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0">
          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Company Name</span>
              <span className="text-gray-600">{company}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Plan</span>
              <Badge variant="secondary">Enterprise</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Status</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Customer Since</span>
              <span className="text-gray-600">March 2024</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm pt-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{`${company.toLowerCase()}.com`}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">250-500 employees</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">$50M - $100M revenue</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Founded in 2015</span>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CompanyInfoCard;
