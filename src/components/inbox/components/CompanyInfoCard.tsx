
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Building2, ChevronUp, ChevronDown, Globe, Users, DollarSign, Calendar, Pencil, Check, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { InlineEditField } from "@/components/companies/detail/InlineEditField";

interface CompanyInfoCardProps {
  company: string;
  isOpen: boolean;
  onToggle: () => void;
}

const CompanyInfoCard = ({ company, isOpen, onToggle }: CompanyInfoCardProps) => {
  const { toast } = useToast();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState({
    name: company,
    website: `${company.toLowerCase()}.com`,
    employees: '250-500 employees',
    revenue: '$50M - $100M revenue',
    founded: 'Founded in 2015'
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

  const renderEditableField = (field: string, icon: React.ReactNode, value: string) => {
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
              <InlineEditField
                value={company}
                companyId="mock-company-id"
                field="name"
                label="Company Name"
              />
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
              <InlineEditField
                value="March 2024"
                companyId="mock-company-id"
                field="customerSince"
                label="Customer Since"
              />
            </div>
            
            {renderEditableField(
              'website',
              <Globe className="h-4 w-4 text-gray-400" />,
              fieldValues.website
            )}
            
            {renderEditableField(
              'employees',
              <Users className="h-4 w-4 text-gray-400" />,
              fieldValues.employees
            )}
            
            {renderEditableField(
              'revenue',
              <DollarSign className="h-4 w-4 text-gray-400" />,
              fieldValues.revenue
            )}
            
            {renderEditableField(
              'founded',
              <Calendar className="h-4 w-4 text-gray-400" />,
              fieldValues.founded
            )}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CompanyInfoCard;
