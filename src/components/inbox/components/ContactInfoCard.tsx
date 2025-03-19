
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  UserCircle, Mail, Phone, Globe, ChevronUp, ChevronDown, 
  MapPin, Clock, Languages, Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContactInfoCardProps {
  customer: string;
  company: string;
  isOpen: boolean;
  onToggle: () => void;
}

const ContactInfoCard = ({ customer, company, isOpen, onToggle }: ContactInfoCardProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="border shadow-sm">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-primary" />
              <span className="font-medium">Contact Information</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Name</span>
              <span className="text-gray-600 text-sm">{customer}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Type</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">Customer</Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{customer.toLowerCase().replace(' ', '.')}@{company.toLowerCase()}.com</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">+1 (555) 123-4567</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{company.toLowerCase()}.com</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">San Francisco, CA</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">PST (UTC-8)</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Languages className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">English</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">VIP</Badge>
                <Badge variant="outline" className="text-xs">Enterprise</Badge>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default ContactInfoCard;
