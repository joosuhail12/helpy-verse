
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  UserCircle, Mail, Phone, Globe, ChevronUp, ChevronDown, 
  MapPin, Clock, Languages, Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from '@/hooks/use-toast';
import { InlineEditField } from "@/components/contacts/detail/InlineEditField";

interface ContactInfoCardProps {
  customer: string;
  company: string;
  isOpen: boolean;
  onToggle: () => void;
}

const ContactInfoCard = ({ customer, company, isOpen, onToggle }: ContactInfoCardProps) => {
  const { toast } = useToast();
  const mockContactId = "mock-contact-id";

  // This would typically be fetched from the API or redux store
  const contactData = {
    id: mockContactId,
    name: customer,
    email: `${customer.toLowerCase().replace(' ', '.')}@${company.toLowerCase()}.com`,
    phone: '+1 (555) 123-4567',
    website: `${company.toLowerCase()}.com`,
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
    language: 'English',
    type: 'customer'
  };

  const handleSaveSuccess = (fieldName: string) => {
    toast({
      title: "Field updated",
      description: `${fieldName} has been successfully updated.`,
    });
  };

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
              <InlineEditField 
                value={contactData.name}
                contactId={mockContactId} 
                label="Name"
                field="name"
                onSave={() => handleSaveSuccess("Name")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Type</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">Customer</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500 text-sm">Email</span>
              </div>
              <InlineEditField
                value={contactData.email}
                contactId={mockContactId}
                field="email"
                label="Email"
                type="email"
                onSave={() => handleSaveSuccess("Email")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500 text-sm">Phone</span>
              </div>
              <InlineEditField
                value={contactData.phone}
                contactId={mockContactId}
                field="phone"
                label="Phone"
                type="phone"
                onSave={() => handleSaveSuccess("Phone")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500 text-sm">Website</span>
              </div>
              <InlineEditField
                value={contactData.website}
                contactId={mockContactId}
                field="website"
                label="Website"
                type="url"
                onSave={() => handleSaveSuccess("Website")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500 text-sm">Location</span>
              </div>
              <InlineEditField
                value={contactData.location}
                contactId={mockContactId}
                field="location"
                label="Location"
                onSave={() => handleSaveSuccess("Location")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500 text-sm">Timezone</span>
              </div>
              <InlineEditField
                value={contactData.timezone}
                contactId={mockContactId}
                field="timezone"
                label="Timezone"
                onSave={() => handleSaveSuccess("Timezone")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500 text-sm">Language</span>
              </div>
              <InlineEditField
                value={contactData.language}
                contactId={mockContactId}
                field="language"
                label="Language"
                onSave={() => handleSaveSuccess("Language")}
              />
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
