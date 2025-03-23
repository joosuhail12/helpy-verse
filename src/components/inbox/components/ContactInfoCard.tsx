import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Phone, Mail, MapPin } from "lucide-react";
import type { Customer } from "@/types/ticket";
import type { Company } from "@/types/company";

interface ContactInfoCardProps {
  customer: Customer | string;
  company?: Company | string;
  isOpen: boolean;
  onToggle: () => void;
}

const ContactInfoCard = ({ customer, company, isOpen, onToggle }: ContactInfoCardProps) => {
  // Convert string customer to object if needed
  const customerObj = typeof customer === 'string' 
    ? { id: customer, name: customer, email: `${customer.toLowerCase().replace(/\s+/g, '.')}@example.com` } 
    : customer;

  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className="flex flex-row items-center justify-between cursor-pointer p-4 bg-gray-50"
        onClick={onToggle}
      >
        <div className="font-medium">Contact Information</div>
        <div>{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="p-4 pt-2 space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-medium">{customerObj.name}</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Email</div>
            <div className="flex items-center">
              <Mail size={14} className="mr-2 text-gray-500" />
              <a href={`mailto:${customerObj.email}`} className="text-blue-600 hover:underline">
                {customerObj.email}
              </a>
            </div>
          </div>
          
          {customerObj.phone && (
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Phone</div>
              <div className="flex items-center">
                <Phone size={14} className="mr-2 text-gray-500" />
                <a href={`tel:${customerObj.phone}`} className="text-blue-600 hover:underline">
                  {customerObj.phone}
                </a>
              </div>
            </div>
          )}
          
          {/* Additional customer info could be rendered here */}
        </CardContent>
      )}
    </Card>
  );
};

export default ContactInfoCard;
