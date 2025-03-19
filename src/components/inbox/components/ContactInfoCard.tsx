
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { User, ChevronUp, ChevronDown, Mail, Phone, MapPin, Calendar } from "lucide-react";
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

  // In a real app, this would be fetched from the API or redux store
  const contactData = {
    id: mockContactId,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: company,
    jobTitle: "Product Manager",
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "United States",
    timezone: "America/Los_Angeles",
    language: "English",
    createdAt: "2023-06-15T08:30:00Z",
    lastContact: "2024-03-12T14:45:00Z"
  };

  const handleFieldSave = (field: string, value: string) => {
    toast({
      title: "Field updated",
      description: `${field} has been successfully updated.`,
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="group">
      <Card className="border shadow-sm hover:shadow-md transition-all duration-200">
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-t-lg group-data-[state=closed]:rounded-lg"
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium">Contact Information</span>
            </div>
            {isOpen ? 
              <ChevronUp className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" /> : 
              <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <div className="space-y-4 text-sm">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between gap-2 py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Full Name</span>
                <div className="flex items-center gap-1">
                  <InlineEditField
                    value={contactData.firstName}
                    contactId={mockContactId}
                    field="firstName"
                    label="First Name"
                    onSave={(value) => handleFieldSave("First Name", value)}
                  />
                  <InlineEditField
                    value={contactData.lastName}
                    contactId={mockContactId}
                    field="lastName"
                    label="Last Name"
                    onSave={(value) => handleFieldSave("Last Name", value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 py-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-500 font-medium">Email</span>
                </div>
                <InlineEditField
                  value={contactData.email}
                  contactId={mockContactId}
                  field="email"
                  label="Email"
                  type="email"
                  onSave={(value) => handleFieldSave("Email", value)}
                />
              </div>

              <div className="flex items-center justify-between gap-2 py-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-500 font-medium">Phone</span>
                </div>
                <InlineEditField
                  value={contactData.phone}
                  contactId={mockContactId}
                  field="phone"
                  label="Phone"
                  type="phone"
                  onSave={(value) => handleFieldSave("Phone", value)}
                />
              </div>

              <div className="flex items-center justify-between gap-2 py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Company</span>
                <InlineEditField
                  value={contactData.company}
                  contactId={mockContactId}
                  field="company"
                  label="Company"
                  onSave={(value) => handleFieldSave("Company", value)}
                />
              </div>

              <div className="flex items-center justify-between gap-2 py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Job Title</span>
                <InlineEditField
                  value={contactData.jobTitle}
                  contactId={mockContactId}
                  field="jobTitle"
                  label="Job Title"
                  onSave={(value) => handleFieldSave("Job Title", value)}
                />
              </div>
            </div>

            <div className="pt-1">
              <div className="flex items-center gap-1.5 mb-3">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
                <span className="font-medium text-gray-700">Address</span>
              </div>
              
              <div className="space-y-2 ml-5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-500">Street</span>
                  <InlineEditField
                    value={contactData.street}
                    contactId={mockContactId}
                    field="street"
                    label="Street"
                    onSave={(value) => handleFieldSave("Street", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-500">City</span>
                  <InlineEditField
                    value={contactData.city}
                    contactId={mockContactId}
                    field="city"
                    label="City"
                    onSave={(value) => handleFieldSave("City", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-500">State/Province</span>
                  <InlineEditField
                    value={contactData.state}
                    contactId={mockContactId}
                    field="state"
                    label="State/Province"
                    onSave={(value) => handleFieldSave("State/Province", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-500">Zip/Postal Code</span>
                  <InlineEditField
                    value={contactData.zipCode}
                    contactId={mockContactId}
                    field="zipCode"
                    label="Zip/Postal Code"
                    onSave={(value) => handleFieldSave("Zip/Postal Code", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-500">Country</span>
                  <InlineEditField
                    value={contactData.country}
                    contactId={mockContactId}
                    field="country"
                    label="Country"
                    onSave={(value) => handleFieldSave("Country", value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-500 font-medium">Last Contact</span>
                </div>
                <span className="text-sm text-gray-700">
                  {new Date(contactData.lastContact).toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <span className="text-gray-500 font-medium">Timezone</span>
                <InlineEditField
                  value={contactData.timezone}
                  contactId={mockContactId}
                  field="timezone"
                  label="Timezone"
                  onSave={(value) => handleFieldSave("Timezone", value)}
                />
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <span className="text-gray-500 font-medium">Language</span>
                <InlineEditField
                  value={contactData.language}
                  contactId={mockContactId}
                  field="language"
                  label="Language"
                  onSave={(value) => handleFieldSave("Language", value)}
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default ContactInfoCard;
