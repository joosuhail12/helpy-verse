
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  UserCircle, Mail, Phone, Globe, ChevronUp, ChevronDown, 
  MapPin, Clock, Languages, Tag, Pencil, Check, X, Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
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
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState({
    name: customer,
    email: `${customer.toLowerCase().replace(' ', '.')}@${company.toLowerCase()}.com`,
    phone: '+1 (555) 123-4567',
    website: `${company.toLowerCase()}.com`,
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
    language: 'English'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleEditField = (field: string) => {
    setEditingField(field);
  };

  const handleSaveField = async (field: string) => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Field updated",
        description: `${field} has been successfully updated.`,
      });
      
    } catch (error) {
      toast({
        title: "Update failed",
        description: `There was an error updating ${field.toLowerCase()}.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setEditingField(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFieldValues({
      ...fieldValues,
      [field]: value
    });
  };

  const renderEditableField = (field: string, icon: React.ReactNode, label: string, value: string) => {
    const isEditing = editingField === field;
    
    return (
      <div className="flex items-center gap-2 text-sm">
        {icon}
        {isEditing ? (
          <div className="flex flex-1 items-center gap-2">
            <Input
              value={fieldValues[field as keyof typeof fieldValues]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="h-7 text-sm flex-1"
              disabled={isSaving}
              autoFocus
            />
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSaveField(field)}
                disabled={isSaving}
                className="h-7 w-7 p-0"
              >
                {isSaving ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3 text-green-500" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="h-7 w-7 p-0"
              >
                <X className="h-3 w-3 text-red-500" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-between group">
            <span className="text-gray-600">{value}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditField(field)}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="h-3 w-3 text-gray-400" />
            </Button>
          </div>
        )}
      </div>
    );
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
                value={customer}
                contactId="mock-contact-id" 
                label="Name"
                field="name"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Type</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">Customer</Badge>
            </div>
            
            {renderEditableField(
              'email', 
              <Mail className="h-4 w-4 text-gray-400" />, 
              'Email',
              fieldValues.email
            )}
            
            {renderEditableField(
              'phone', 
              <Phone className="h-4 w-4 text-gray-400" />, 
              'Phone',
              fieldValues.phone
            )}
            
            {renderEditableField(
              'website', 
              <Globe className="h-4 w-4 text-gray-400" />, 
              'Website',
              fieldValues.website
            )}
            
            {renderEditableField(
              'location', 
              <MapPin className="h-4 w-4 text-gray-400" />, 
              'Location',
              fieldValues.location
            )}
            
            {renderEditableField(
              'timezone', 
              <Clock className="h-4 w-4 text-gray-400" />, 
              'Timezone',
              fieldValues.timezone
            )}
            
            {renderEditableField(
              'language', 
              <Languages className="h-4 w-4 text-gray-400" />, 
              'Language',
              fieldValues.language
            )}
            
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
